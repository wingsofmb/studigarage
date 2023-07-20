import { AfterViewInit, Component, OnDestroy, TrackByFunction, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, Subject, combineLatest, map, switchMap, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ReviewApiService } from 'src/data-layer/review/review-api.service';
import { Review } from 'src/data-layer/review/review.model';
import { reviewStatusActionMapping, reviewStatusMapping } from 'src/data-layer/review/review-status-mapping';
import { ReviewStatus } from 'src/data-layer/review/review-status.enum';
import { RolesService } from 'src/app/auth/_services/roles.service';
import { ScoreComponent } from 'src/app/shared/score/score.component';
import { MatSelectModule } from '@angular/material/select';
import { UpsertReviewComponent } from 'src/app/shared/upsert-review/upsert-review.component';

type Filters = { q: string; status: ReviewStatus };

@Component({
  selector: 'app-review-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    ScoreComponent,
    MatSelectModule,
  ],
  providers: [ReviewApiService],
  templateUrl: './review-management.component.html',
  styleUrls: ['./review-management.component.scss'],
})
export class ReviewManagementComponent implements AfterViewInit, OnDestroy {
  public isAdmin = false;
  public displayedColumns: string[] = ['status', 'createdAt', 'score', 'name', 'comment', 'action'];
  public dataSource: MatTableDataSource<Review> = new MatTableDataSource<Review>([]);
  public statusMapping = reviewStatusMapping;
  public reviewStatusActionMapping = reviewStatusActionMapping;
  public reviewStatus = ReviewStatus;
  public searchBar = new FormControl('');
  public statusFilter = new FormControl('');
  public trackByFunction: TrackByFunction<Review> = (index: number, item: Review) => item.id;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  private refresh$: Subject<null> = new Subject();
  private _destroy$: Subject<null> = new Subject();

  constructor(roleService: RolesService, private reviewApiService: ReviewApiService, public dialog: MatDialog) {
    this.isAdmin = roleService.isAdmin();
  }

  public ngAfterViewInit() {
    const data$ = this.refresh$.pipe(
      switchMap(() => this.reviewApiService.getAll()),
      takeUntil(this._destroy$),
    );

    const q$ = new BehaviorSubject<string | null>('');
    const status$ = new BehaviorSubject<ReviewStatus | null>(null);
    this.searchBar.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(q$);
    this.statusFilter.valueChanges
      .pipe(
        map((status) => (status === 'ALL' ? null : (status as ReviewStatus))),
        takeUntil(this._destroy$),
      )
      .subscribe(status$);

    combineLatest([q$, status$])
      .pipe(takeUntil(this._destroy$))
      .subscribe(([q, status]: [string | null, ReviewStatus | null]) => {
        if (!this.dataSource) return;
        this.dataSource.filter = { q, status } as unknown as string;
      });

    data$.pipe(takeUntil(this._destroy$)).subscribe((review: Review[]) => {
      this.dataSource = new MatTableDataSource<Review>(review);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data: Review, filter: unknown) => {
        const f = filter as Filters;
        const cleanStr = (s: string) => s.trim().toLocaleLowerCase();
        const matchQ = cleanStr(data.name).includes(cleanStr(f.q) ?? '');
        const matchStatus = data.status === (f.status ?? data.status);
        return matchQ && matchStatus;
      };
    });
    this.refresh$.next(null);
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
  }

  public updateReview(review: Review, status: ReviewStatus): void {
    this.reviewApiService
      .update(review.id, { status })
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.refresh$.next(null));
  }

  public deleteReview(review: Review): void {
    this.reviewApiService
      .delete(review.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.refresh$.next(null));
  }

  public createReview(): void {
    const dialogRef = this.dialog.open(UpsertReviewComponent);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.refresh$.next(null));
  }
}
