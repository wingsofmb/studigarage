import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Car } from 'src/data-layer/car/car.model';
import { gearBoxMapping } from 'src/data-layer/car/gear-box-mapping';
import { energyTypeMapping } from 'src/data-layer/car/energy-type-mapping';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule],
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
})
export class CarComponent {
  @Input()
  public car: Car | null = null;

  public gearBoxMapping = gearBoxMapping;
  public energyTypeMapping = energyTypeMapping;

  public seeCarDetail(): void {
    console.log(this.car);
  }
}
