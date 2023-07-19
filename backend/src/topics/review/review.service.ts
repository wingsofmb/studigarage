import { Injectable } from '@nestjs/common';
import { Prisma, Review, ReviewStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateReviewInputDto } from 'src/topics/review/dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  public async fetchReviewByPk(id: number): Promise<Review> {
    return this.prismaService.review.findUnique({ where: { id } });
  }

  public async fetchReviews(): Promise<Review[]> {
    return this.prismaService.review.findMany();
  }

  public async createReview(requestBody: Prisma.ReviewCreateInput): Promise<Review> {
    const data = {
      ...requestBody,
      status: ReviewStatus.PENDING,
    };
    return this.prismaService.review.create({ data });
  }

  public async updateReview(id: number, requestBody: UpdateReviewInputDto): Promise<Review> {
    await this.prismaService.review.findUniqueOrThrow({ where: { id } });
    return this.prismaService.review.update({ where: { id }, data: requestBody });
  }

  public async deleteReview(id: number): Promise<Review> {
    return this.prismaService.review.delete({ where: { id: Number(id) } });
  }
}
