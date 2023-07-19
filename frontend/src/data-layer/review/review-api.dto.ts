import { QueryParams } from 'src/data-layer/_shared/http.model';
import { ReviewStatus } from 'src/data-layer/review/review-status.enum';

export type GetAllReviewQP = QueryParams & {
  offset?: number;
  limit?: number;
};

export interface CreateReviewPayload {
  name: string;
  comment: string;
  score: number;
}

export interface UpdateReviewPayload {
  status: ReviewStatus;
}

export interface GlobalReviewStats {
  averageScore: number;
  amount: number;
}
