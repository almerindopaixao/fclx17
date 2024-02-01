import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserReq } from '../auth/decorators/user-req.decorator';
import { User } from '../auth/interfaces/auth.interfaces';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @UserReq() user: User) {
    return this.ordersService.create({
      ...createOrderDto,
      client_id: user.sub,
    });
  }

  @Get()
  findAll(@UserReq() user: User) {
    return this.ordersService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserReq() user: User) {
    return this.ordersService.findOne(id, user.sub);
  }
}
