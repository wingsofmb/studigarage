import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CarApiService } from 'src/data-layer/car/car-api.service';
import { CarListComponent } from 'src/app/shared/car-list/car-list.component';

@Component({
  selector: 'app-car-management',
  standalone: true,
  imports: [CommonModule, MatButtonModule, CarListComponent],
  providers: [CarApiService],
  templateUrl: './car-management.component.html',
  styleUrls: ['./car-management.component.scss'],
})
export class CarManagementComponent {
  constructor(private carApiService: CarApiService) {}

  public createCar(): void {
    console.log('CreateCar');
  }
}
