import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarApiService } from 'src/data-layer/car/car-api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Car } from 'src/data-layer/car/car.model';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { gearBoxMapping } from 'src/data-layer/car/gear-box-mapping';
import { energyTypeMapping } from 'src/data-layer/car/energy-type-mapping';
import { ContactFormComponent } from 'src/app/shared/contact-form/contact-form.component';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  providers: [CarApiService],
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss'],
})
export class CarDetailComponent {
  public car: Car | null = null;
  public mainPicture = 'https://image-annonce.lacentrale.fr/352x264/E112385352_STANDARD_0.jpg?uncache=1686661831';
  public pictures = [
    'https://image-annonce.lacentrale.fr/352x264/E112385352_STANDARD_0.jpg?uncache=1686661831',
    'https://image-annonce.lacentrale.fr/352x264/E112447020_STANDARD_0.jpg?uncache=1686752883',
    'https://image-annonce.lacentrale.fr/352x264/E111130435_STANDARD_0.jpg?uncache=1677295281',
    'https://image-annonce.lacentrale.fr/352x264/E112606627_STANDARD_0.jpg?uncache=1689603531',
  ];
  public gearBoxMapping = gearBoxMapping;
  public energyTypeMapping = energyTypeMapping;

  private _destroy$: Subject<null> = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public carId: number,
    public dialogRef: MatDialogRef<CarDetailComponent>,
    private dialog: MatDialog,
    private carApiService: CarApiService,
  ) {
    this.carApiService
      .get(carId)
      .pipe(takeUntil(this._destroy$))
      .subscribe((car: Car) => (this.car = car));
  }

  public contact(): void {
    if (!this.car) return;
    const year = DateTime.fromISO(this.car?.firstCirculationDate).year;
    const subject = `Annonce n°${this.carId} : ${this.car.brand} ${this.car.model}, ${year} - ${this.car.mileage}km - ${this.car.price}€`;
    this.dialog.open(ContactFormComponent, { data: subject });
  }
}
