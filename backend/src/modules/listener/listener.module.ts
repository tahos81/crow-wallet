import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities';
import { ListenerService } from './listener.service';
import { PublisherService } from 'src/modules/publisher/publisher.service';
import { JwtModule } from '@nestjs/jwt';
import { CONFIG } from 'src/config';

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
})
export class ListenerModule {}
