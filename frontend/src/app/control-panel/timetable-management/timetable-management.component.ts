import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimetableApiService } from 'src/data-layer/timetable/timatable-api.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, Subject, catchError, of, takeUntil, zip } from 'rxjs';
import { Timetable } from 'src/data-layer/timetable/timetable.model';
import { Days } from 'src/data-layer/timetable/day.enum';
import { dayMapping } from 'src/data-layer/timetable/day-mapping.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-timetable-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatSnackBarModule],
  providers: [TimetableApiService],
  templateUrl: './timetable-management.component.html',
  styleUrls: ['./timetable-management.component.scss'],
})
export class TimetableManagementComponent implements OnInit, OnDestroy {
  public errorCode: number | null = null;
  public days: string[] = _.keys(Days);
  public dayMapping;

  public formGroup = new FormGroup({
    [Days.MONDAY as string]: new FormControl('', [Validators.required]),
    [Days.TUESDAY as string]: new FormControl('', [Validators.required]),
    [Days.WEDNESDAY as string]: new FormControl('', [Validators.required]),
    [Days.THURSDAY as string]: new FormControl('', [Validators.required]),
    [Days.FRIDAY as string]: new FormControl('', [Validators.required]),
    [Days.SATURDAY as string]: new FormControl('', [Validators.required]),
    [Days.SUNDAY as string]: new FormControl('', [Validators.required]),
  });

  private _destroy$: Subject<null> = new Subject();
  private rawTimetables: Timetable[] = [];

  constructor(private timetableApiService: TimetableApiService, private snackBar: MatSnackBar) {
    this.dayMapping = _.mapKeys(dayMapping, (v, k) => k as string);
  }

  public ngOnInit(): void {
    this.timetableApiService
      .getAll()
      .pipe(takeUntil(this._destroy$))
      .subscribe((timetables: Timetable[]) => {
        this.rawTimetables = timetables;
        const byDays = _.mapValues(_.keyBy(timetables, 'day'), 'businessHour');
        this.formGroup.setValue(byDays);
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
  }

  public submitForm(): void {
    if (this.formGroup.errors) return;

    const updatePayloads: Array<{ id: number; businessHour: string }> = this.rawTimetables.map((t: Timetable) => ({
      id: t.id,
      businessHour: this.formGroup.value[t.day] as string,
    }));
    const streams$: Array<Observable<Timetable>> = updatePayloads.map((payload: { id: number; businessHour: string }) =>
      this.timetableApiService.update(payload.id, _.omit(payload, 'id')).pipe(takeUntil(this._destroy$)),
    );
    zip(streams$)
      .pipe(
        takeUntil(this._destroy$),
        catchError((error) => {
          this.errorCode = +error.status;
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (!response) return;
        this.snackBar.open('Informations mises à jour', 'OK', { duration: 1000 });
        this.errorCode = null;
      });
  }
}
