import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import * as _ from 'lodash';
import { CarApiService } from 'src/data-layer/car/car-api.service';
import { Car } from 'src/data-layer/car/car.model';
import { EnergyType } from 'src/data-layer/car/energy-type.enum';
import { GearBoxType } from 'src/data-layer/car/gear-box-type.enum';
import { gearBoxMapping } from 'src/data-layer/car/gear-box-mapping';
import { energyTypeMapping } from 'src/data-layer/car/energy-type-mapping';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-car-upsert',
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
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [
    CarApiService,
    {
      provide: DateAdapter,
      useClass: NativeDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  templateUrl: './car-upsert.component.html',
  styleUrls: ['./car-upsert.component.scss'],
})
export class CarUpsertComponent implements OnInit {
  public GearBoxType = GearBoxType;
  public gearBoxKeys = _.keys(GearBoxType);
  public gearBoxMapping = gearBoxMapping;
  public EnergyType = EnergyType;
  public energyTypeKeys = _.keys(EnergyType);
  public energyTypeMapping = energyTypeMapping;

  public isCreation = false;
  public errorCode: number | null = null;
  public formGroup = new FormGroup({
    brand: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    firstCirculationDate: new FormControl('', [Validators.required]),
    mileage: new FormControl('', [Validators.required, Validators.min(0)]),
    energy: new FormControl('', [Validators.required]),
    gearBox: new FormControl('', [Validators.required]),
    insideColor: new FormControl('', [Validators.required]),
    outsideColor: new FormControl('', [Validators.required]),
  });
  public matchedBp = '';
  public breakpoints = Breakpoints;

  private _destroy$: Subject<null> = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Car | null,
    public dialogRef: MatDialogRef<CarUpsertComponent>,
    private carApiService: CarApiService,
    private snackBar: MatSnackBar,
    private responsive: BreakpointObserver,
  ) {
    this.responsive
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
      .pipe(takeUntil(this._destroy$))
      .subscribe((state: BreakpointState) => {
        this.matchedBp = _.keys(state.breakpoints).filter((bp) => state.breakpoints[bp])[0];
      });
  }

  public ngOnInit(): void {
    this.isCreation = this.data === null;
    if (this.data !== null) {
      this.formGroup.setValue({
        ..._.pick(this.data, ['brand', 'model', 'firstCirculationDate', 'energy', 'gearBox', 'insideColor', 'outsideColor']),
        price: `${this.data.price}`,
        mileage: `${this.data.mileage}`,
        // firstCirculationDate: DateTime.fromISO(this.data.firstCirculationDate).toJSDate as unknown as string,
      });
    }
  }

  public saveForm(): void {
    console.log('here');
    if (this.formGroup.errors) return;

    const brand = this.formGroup.value.brand as string;
    const model = this.formGroup.value.model as string;
    const firstCirculationDate = new Date(this.formGroup.value.firstCirculationDate as string).toISOString();
    const price = Number(this.formGroup.value.price);
    const mileage = Number(this.formGroup.value.mileage);
    const energy = this.formGroup.value.energy as EnergyType;
    const gearBox = this.formGroup.value.gearBox as GearBoxType;
    const insideColor = this.formGroup.value.insideColor as string;
    const outsideColor = this.formGroup.value.outsideColor as string;
    const payload = {
      brand,
      model,
      firstCirculationDate,
      price,
      mileage,
      energy,
      gearBox,
      insideColor,
      outsideColor,
    };
    const upsert$ = this.data === null ? this.carApiService.create(payload) : this.carApiService.update(this.data?.id, payload);

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
        this.snackBar.open(this.data === null ? 'Annonce ajouté' : 'Annonce modifié', 'OK', { duration: 1000 });
        this.errorCode = null;
        this.dialogRef.close(response);
      });
  }

  public setMonthAndYear(normalizedMonthAndYear: string, datepicker: MatDatepicker<unknown>) {
    this.formGroup.controls.firstCirculationDate.setValue(normalizedMonthAndYear);
    datepicker.close();
  }
}
