import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewController } from 'src/topics/review/review.controller';
import { ReviewService } from 'src/topics/review/review.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService],
  exports: [ReviewService],
})
export class ReviewModule {}
