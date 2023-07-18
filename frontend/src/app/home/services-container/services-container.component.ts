import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import * as _ from 'lodash';
import { MatDividerModule } from '@angular/material/divider';
import { RepairServiceApiService } from 'src/data-layer/repair-service/repair-service-api.service';
import { RepairService } from 'src/data-layer/repair-service/repair-service.model';
import { Subject, takeUntil } from 'rxjs';
import { serviceThemeMapping } from 'src/data-layer/repair-service/repair-service-mapping';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-services-container',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatDividerModule, MatButtonModule],
  providers: [RepairServiceApiService],
  templateUrl: './services-container.component.html',
  styleUrls: ['./services-container.component.scss'],
})
export class ServicesContainerComponent implements OnInit, OnDestroy {
  public themes: string[] = [];
  public groupedServices: { [key: string]: RepairService[] } = {};
  public themeMapping = serviceThemeMapping;
  public hoverId: number | null = null;

  private _destroy$: Subject<null> = new Subject();

  constructor(private rsApiService: RepairServiceApiService) {}

  public ngOnInit(): void {
    this.rsApiService
      .getAll()
      .pipe(takeUntil(this._destroy$))
      .subscribe((rs: RepairService[]) => {
        const grouped = _.groupBy(rs, 'theme');
        this.groupedServices = _.mapValues(grouped, (s: RepairService[]) => _.sortBy(s, 'name'));
        this.themes = _.keys(this.groupedServices);
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
  }

  public buy(service: RepairService): void {
    console.log(service.id);
  }
}
