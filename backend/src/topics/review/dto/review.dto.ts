import { ReviewStatus } from '@prisma/client';
import { IsString, IsEnum, IsInt, Min, Max } from 'class-validator';

export class CreateReviewInputDto {
  @IsString()
  name: string;

  @IsString()
  comment: string;

  @IsInt()
  @Min(0)
  @Max(5)
  score: number;
}

export class UpdateReviewInputDto {
  @IsEnum(ReviewStatus)
  status: ReviewStatus;
}
