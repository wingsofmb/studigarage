import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Car } from 'src/data-layer/car/car.model';
import { gearBoxMapping } from 'src/data-layer/car/gear-box-mapping';
import { energyTypeMapping } from 'src/data-layer/car/energy-type-mapping';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CarDetailComponent } from 'src/app/shared/cars/car-detail/car-detail.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatDialogModule],
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
})
export class CarComponent {
  @Input()
  public car: Car | null = null;

  @Input()
  public isManagement = false;

  @Output()
  public refresh: EventEmitter<null> = new EventEmitter();

  public gearBoxMapping = gearBoxMapping;
  public energyTypeMapping = energyTypeMapping;

  constructor(private dialog: MatDialog) {}

  public seeCarDetail(): void {
    const dialog = this.dialog.open(CarDetailComponent, { data: { id: this.car?.id, isManagement: this.isManagement } });
    dialog.afterClosed().subscribe((res: { forceRefresh: boolean }) => {
      if (res?.forceRefresh) this.refresh.next(null);
    });
  }
}
