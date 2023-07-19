import { ReviewStatus } from 'src/data-layer/review/review-status.enum';

export interface Review {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  score: number;
  comment: string;
  status: ReviewStatus;
}
