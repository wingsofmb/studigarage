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
import { RepairServiceApiService } from 'src/data-layer/repair-service/repair-service-api.service';
import { ServiceTheme } from 'src/data-layer/repair-service/service-theme.enum';
import { serviceThemeMapping } from 'src/data-layer/repair-service/repair-service-mapping';
import * as _ from 'lodash';

@Component({
  selector: 'app-rs-upsert',
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
  ],
  providers: [RepairServiceApiService],
  templateUrl: './rs-upsert.component.html',
  styleUrls: ['./rs-upsert.component.scss'],
})
export class RSUpsertComponent {
  public errorCode: number | null = null;
  public formGroup = new FormGroup({
    theme: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
  });
  public themeMapping = serviceThemeMapping;
  public themes: string[] = [];
  private _destroy$: Subject<null> = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User | null,
    public dialogRef: MatDialogRef<RSUpsertComponent>,
    private repairServiceApiService: RepairServiceApiService,
    private snackBar: MatSnackBar,
  ) {
    this.themes = _.keys(ServiceTheme);
  }

  public saveForm(): void {
    if (this.formGroup.errors) return;

    const theme = this.formGroup.value.theme as ServiceTheme;
    const name = this.formGroup.value.name as string;
    const price = Number(this.formGroup.value.price);
    const payload = { theme, name, price };
    const upsert$ = this.repairServiceApiService.create(payload);

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
        this.snackBar.open('Service de réparation ajouté', 'OK', { duration: 1000 });
        this.dialogRef.close(response);
      });
  }
}
