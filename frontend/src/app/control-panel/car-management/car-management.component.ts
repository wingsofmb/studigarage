import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CarApiService } from 'src/data-layer/car/car-api.service';
import { CarListComponent } from 'src/app/shared/cars/car-list/car-list.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CarUpsertComponent } from 'src/app/shared/cars/car-upsert/car-upsert.component';
import * as _ from 'lodash';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-car-management',
  standalone: true,
  imports: [CommonModule, MatButtonModule, CarListComponent, MatDialogModule],
  providers: [CarApiService],
  templateUrl: './car-management.component.html',
  styleUrls: ['./car-management.component.scss'],
})
export class CarManagementComponent {
  public random = _.random(0, 1000000);
  constructor(private carApiService: CarApiService, private dialog: MatDialog) {}

  private _destroy$: Subject<null> = new Subject();

  public createCar(): void {
    const modal = this.dialog.open(CarUpsertComponent);

    modal
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        // Force child car-list to refresh data with new / modified car.
        this.random = _.random(0, 1000000);
      });
  }
}
