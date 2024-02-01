import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://admin:admin@message_broker:5672',
      connectionInitOptions: {
        wait: true,
        timeout: 30000,
      },
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitmqModule {}
