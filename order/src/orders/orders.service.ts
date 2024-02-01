import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly dataSource: DataSource,

    private readonly amqpConnection: AmqpConnection,
  ) {}

  async create(createOrderDto: CreateOrderDto & { client_id: number }) {
    const productIds = createOrderDto.items.map(({ product_id }) => product_id);
    const uniqueProductIds = [...new Set(productIds)];
    const products = await this.productRepository.findBy({
      id: In(uniqueProductIds),
    });

    if (products.length !== uniqueProductIds.length) {
      const receivedProductIds = uniqueProductIds.join(', ');
      const findedProductIds = products.map(({ id }) => id).join(', ');
      const msgError = `Algum produto não existe. Produtos passados ${receivedProductIds}, produtos encontrados ${findedProductIds}`;

      throw new Error(msgError);
    }

    const order = Order.create({
      client_id: createOrderDto.client_id,
      items: createOrderDto.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: products.find((p) => p.id === item.product_id).price,
      })),
    });

    return this.useTransaction(order, async () => {
      await this.amqpConnection.publish('amq.direct', 'OrderCreated', {
        order_id: order.id,
        card_hash: createOrderDto.card_hash,
        total: order.total,
      });
    });
  }

  findAll(client_id: number) {
    return this.orderRepository.find({
      where: {
        client_id,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: string, client_id: number) {
    try {
      const result = await this.orderRepository.findOneOrFail({
        where: {
          id,
          client_id,
        },
      });

      return result;
    } catch (err) {
      throw new BadRequestException(`Order '${id}' não encontrada.`);
    }
  }

  async useTransaction<T>(value: T, cb: () => Promise<void>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.save<typeof value>(value);
      await cb();
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
