import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarApiService } from 'src/data-layer/car/car-api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Car } from 'src/data-layer/car/car.model';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { gearBoxMapping } from 'src/data-layer/car/gear-box-mapping';
import { energyTypeMapping } from 'src/data-layer/car/energy-type-mapping';
import { ContactFormComponent } from 'src/app/shared/contact-form/contact-form.component';
import { DateTime } from 'luxon';
import { RolesService } from 'src/app/auth/_services/roles.service';
import { CarUpsertComponent } from 'src/app/shared/cars/car-upsert/car-upsert.component';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { CarPicture } from 'src/data-layer/car/car-picture.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  providers: [CarApiService],
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss'],
})
export class CarDetailComponent {
  public car: Car | null = null;
  public mainPicture = '';
  public pictures: string[] = [];
  public gearBoxMapping = gearBoxMapping;
  public energyTypeMapping = energyTypeMapping;

  private refresh$: BehaviorSubject<null> = new BehaviorSubject(null);
  private _destroy$: Subject<null> = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number; isManagement: boolean },
    public dialogRef: MatDialogRef<CarDetailComponent>,
    private dialog: MatDialog,
    private roleService: RolesService,
    private carApiService: CarApiService,
  ) {
    this.refresh$
      .pipe(
        switchMap(() => this.carApiService.get(this.data.id)),
        takeUntil(this._destroy$),
      )
      .subscribe((car: Car) => {
        this.car = car;
        this.mainPicture = car.carPictures[0]?.fileUrl;
        this.pictures = car.carPictures.map((x: CarPicture) => x.fileUrl);
        console.log('updatepostrefrest');
      });
  }

  public contact(): void {
    if (!this.car) return;
    const year = DateTime.fromISO(this.car?.firstCirculationDate).year;
    const subject = `Annonce n°${this.data.id} : ${this.car.brand} ${this.car.model}, ${year} - ${this.car.mileage}km - ${this.car.price}€g`;
    this.dialog.open(ContactFormComponent, { data: subject });
  }

  public updateCar(): void {
    if (!this.data.isManagement) return;
    if (this.roleService.isVisitor()) return;
    const dialog = this.dialog.open(CarUpsertComponent, { data: this.car });

    dialog
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.refresh$.next(null);
        console.log('cast refresh');
      });
  }

  public deleteCar(): void {
    const dialog = this.dialog.open(ConfirmModalComponent);
    dialog
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe((confirmed: boolean) => {
        console.log(confirmed);
        if (confirmed && this.car) {
          this.carApiService
            .delete(this.car.id)
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => this.dialogRef.close({ forceRefresh: true }));
        }
      });
  }
}
