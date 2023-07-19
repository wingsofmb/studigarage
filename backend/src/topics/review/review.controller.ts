import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Request } from '@nestjs/common';
import { ReviewStatus, type Review } from '@prisma/client';
import { ApiValidationPipe } from 'src/common/pipes/api-validation.pipe';
import { PublicApi } from 'src/topics/auth/decorators/public-api.decorator';
import { Roles } from 'src/topics/auth/decorators/roles.decorator';
import { CreateReviewInputDto, UpdateReviewInputDto } from 'src/topics/review/dto/review.dto';
import { ReviewService } from 'src/topics/review/review.service';
import { UserRoles } from 'src/topics/user/role.enum';

@Controller('api/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('')
  @PublicApi()
  public async getReviews(): Promise<Review[]> {
    return this.reviewService.fetchReviews();
  }

  @Post('')
  @PublicApi()
  public async createReview(@Body(new ApiValidationPipe()) requestBody: CreateReviewInputDto, @Request() req: Request): Promise<Review> {
    // If logged
    const role = req['user']?.role ?? null;
    const reviewAutomaticStatus = role ? ReviewStatus.VALIDATED : ReviewStatus.PENDING;
    const data = {
      ...requestBody,
      status: reviewAutomaticStatus,
    };
    return this.reviewService.createReview(data);
  }

  @Get(':id')
  @PublicApi()
  public async getReview(@Param('id', ParseIntPipe) id: string): Promise<Review> {
    return this.reviewService.fetchReviewByPk(Number(id));
  }

  @Put(':id')
  @Roles(UserRoles.ADMIN, UserRoles.EMPLOYEE)
  public async updateReview(@Param('id') id: string, @Body(new ApiValidationPipe()) requestBody: UpdateReviewInputDto): Promise<Review> {
    const review = await this.reviewService.fetchReviewByPk(Number(id));
    if (!review) throw new NotFoundException();

    return this.reviewService.updateReview(Number(id), requestBody);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)
  async deleteReview(@Param('id', ParseIntPipe) id: string): Promise<Review> {
    return this.reviewService.deleteReview(Number(id));
  }
}
