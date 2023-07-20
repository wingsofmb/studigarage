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

export class GetAllReviewInputDto {
  @IsInt()
  @Min(0)
  @Max(100)
  limit?: number;

  @IsInt()
  @Min(0)
  @Max(5000)
  offset?: number;
}

export interface GlobalReviewStats {
  averageScore: number;
  amount: number;
}
