import { Module } from '@nestjs/common';
import { PublisherController } from './publisher.controller';
import { PublisherService } from 'src/modules/publisher/publisher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities';
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
  providers: [PublisherService],
  controllers: [PublisherController],
})
export class PublisherModule {}
