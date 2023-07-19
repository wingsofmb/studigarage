import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { ReviewApiService } from 'src/data-layer/review/review-api.service';
import { Review } from 'src/data-layer/review/review.model';
import { Subject, takeUntil } from 'rxjs';
import { GlobalReviewStats } from 'src/data-layer/review/review-api.dto';
import { ScoreComponent } from 'src/app/shared/score/score.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpsertReviewComponent } from 'src/app/shared/upsert-review/upsert-review.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatDividerModule, ScoreComponent, MatDialogModule],
  providers: [ReviewApiService],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  public lastReviews: Review[] = [];
  public reviewStats: GlobalReviewStats = { amount: 0, averageScore: 0 };

  private _destroy$: Subject<null> = new Subject<null>();

  constructor(private reviewApiService: ReviewApiService, public dialog: MatDialog) {}

  public ngOnInit(): void {
    this.reviewApiService
      .getAllPublic({ limit: 2 })
      .pipe(takeUntil(this._destroy$))
      .subscribe((reviews: Review[]) => (this.lastReviews = reviews));

    this.reviewApiService
      .getStats()
      .pipe(takeUntil(this._destroy$))
      .subscribe((stats: GlobalReviewStats) => (this.reviewStats = stats));
  }

  public createReview(): void {
    this.dialog.open(UpsertReviewComponent);
  }
}
