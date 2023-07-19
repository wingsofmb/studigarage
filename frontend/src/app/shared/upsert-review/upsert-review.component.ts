import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/data-layer/user/user.model';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { ScoreComponent } from 'src/app/shared/score/score.component';
import { ReviewApiService } from 'src/data-layer/review/review-api.service';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-upsert-review',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectModule,
    ScoreComponent,
    TextFieldModule,
  ],
  providers: [ReviewApiService],
  templateUrl: './upsert-review.component.html',
  styleUrls: ['./upsert-review.component.scss'],
})
export class UpsertReviewComponent {
  public errorCode: number | null = null;
  public score$: Subject<number> = new Subject<number>();
  public formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    score: new FormControl('', [Validators.required, Validators.min(0), Validators.max(5)]),
    comment: new FormControl('', [Validators.required, Validators.min(0)]),
  });

  private _destroy$: Subject<null> = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User | null,
    public dialogRef: MatDialogRef<UpsertReviewComponent>,
    private reviewApiService: ReviewApiService,
    private snackBar: MatSnackBar,
  ) {
    this.score$.pipe(takeUntil(this._destroy$)).subscribe((value: number) => {
      this.formGroup.controls.score.setValue(`${value}`);
    });
  }

  public saveForm(): void {
    if (this.formGroup.errors) return;

    const name = this.formGroup.value.name as string;
    const score = Number(this.formGroup.value.score);
    const comment = this.formGroup.value.comment as string;
    const payload = { name, score, comment };
    const upsert$ = this.reviewApiService.create(payload);

    upsert$
      .pipe(
        takeUntil(this._destroy$),
        catchError((error) => {
          this.errorCode = +error.status;
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (!response) return;
        this.snackBar.open('Merci pour votre avis.', 'OK', { duration: 1000 });
        this.dialogRef.close(response);
      });
  }
}
