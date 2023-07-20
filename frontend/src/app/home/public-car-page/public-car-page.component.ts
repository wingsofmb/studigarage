import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { CarListComponent } from 'src/app/shared/cars/car-list/car-list.component';

@Component({
  selector: 'app-public-car-page',
  standalone: true,
  imports: [CommonModule, MatDividerModule, CarListComponent],
  templateUrl: './public-car-page.component.html',
  styleUrls: ['./public-car-page.component.scss'],
})
export class PublicCarPageComponent {}
