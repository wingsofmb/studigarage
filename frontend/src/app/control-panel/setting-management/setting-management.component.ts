import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { SettingApiService } from 'src/data-layer/setting/setting-api.service';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { Setting } from 'src/data-layer/setting/setting.model';

@Component({
  selector: 'app-setting-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatSnackBarModule],
  providers: [SettingApiService],
  templateUrl: './setting-management.component.html',
  styleUrls: ['./setting-management.component.scss'],
})
export class SettingManagementComponent implements OnInit, OnDestroy {
  public errorCode: number | null = null;

  public formGroup = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.pattern(/\+\d{2}( )?(\d( )?){9}/)]),
    address: new FormControl('', [Validators.required]),
  });
  private _destroy$: Subject<null> = new Subject();

  constructor(private settingApiService: SettingApiService, private snackBar: MatSnackBar) {}

  public ngOnInit(): void {
    this.settingApiService
      .get()
      .pipe(takeUntil(this._destroy$))
      .subscribe((setting: Setting) => {
        const { phone, address } = setting;
        this.formGroup.setValue({ phone, address });
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
  }

  public submitForm(): void {
    if (this.formGroup.errors) return;

    const phone = this.formGroup.value.phone as string;
    const address = this.formGroup.value.address as string;
    const update$ = this.settingApiService.update({ phone, address }).pipe(takeUntil(this._destroy$));

    update$
      .pipe(
        catchError((error) => {
          this.errorCode = +error.status;
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (!response) return;
        this.snackBar.open('Informations mises à jour', 'OK', { duration: 2000 });
        this.errorCode = null;
      });
  }
}
