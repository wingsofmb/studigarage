import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/data-layer/_shared/backend.service';
import { CreateReviewPayload, GetAllReviewQP, GlobalReviewStats, UpdateReviewPayload } from 'src/data-layer/review/review-api.dto';
import { Review } from 'src/data-layer/review/review.model';

@Injectable()
export class ReviewApiService {
  constructor(private backendService: BackendService) {}

  public getAllPublic(qp?: GetAllReviewQP): Observable<Review[]> {
    return this.backendService.get<Review[]>('reviews/public', qp);
  }

  public getStats(): Observable<GlobalReviewStats> {
    return this.backendService.get<GlobalReviewStats>('reviews/stats');
  }

  public getAll(qp?: GetAllReviewQP): Observable<Review[]> {
    return this.backendService.get<Review[]>('reviews', qp);
  }

  public get(id: number): Observable<Review> {
    return this.backendService.get<Review>(`reviews/${id}`);
  }

  public create(payload: CreateReviewPayload): Observable<Review> {
    return this.backendService.post<Review, CreateReviewPayload>('reviews', payload);
  }

  public update(id: number, payload: UpdateReviewPayload): Observable<Review> {
    return this.backendService.put<Review, UpdateReviewPayload>(`reviews/${id}`, payload);
  }

  public delete(id: number): Observable<Review> {
    return this.backendService.delete<Review>(`reviews/${id}`);
  }
}
