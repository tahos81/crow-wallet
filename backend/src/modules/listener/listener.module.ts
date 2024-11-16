import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities';
import { ListenerService } from './listener.service';
import { PublisherService } from 'src/modules/publisher/publisher.service';
import { JwtModule } from '@nestjs/jwt';
import { CONFIG } from 'src/config';
import { ListenerController } from 'src/modules/listener/listener.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    JwtModule.registerAsync({
      useFactory() {
        return {
          secret: CONFIG.JWT_SECRET,
        };
      },
    }),
  ],
  providers: [ListenerService, PublisherService],
  controllers: [ListenerController],
})
export class ListenerModule {}
