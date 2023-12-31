import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import * as _ from 'lodash';
import { MatDividerModule } from '@angular/material/divider';
import { RepairServiceApiService } from 'src/data-layer/repair-service/repair-service-api.service';
import { RepairService } from 'src/data-layer/repair-service/repair-service.model';
import { Subject, takeUntil } from 'rxjs';
import { serviceThemeMapping } from 'src/data-layer/repair-service/service-theme-mapping';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContactFormComponent } from 'src/app/shared/contact-form/contact-form.component';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-services-container',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatDividerModule, MatButtonModule, MatDialogModule],
  providers: [RepairServiceApiService],
  templateUrl: './services-container.component.html',
  styleUrls: ['./services-container.component.scss'],
})
export class ServicesContainerComponent implements OnInit, OnDestroy {
  public themes: string[] = [];
  public groupedServices: { [key: string]: RepairService[] } = {};
  public themeMapping = serviceThemeMapping;
  public hoverId: number | null = null;
  public isXSmallBp = false;
  public breakpoints = Breakpoints;

  private _destroy$: Subject<null> = new Subject();

  constructor(private rsApiService: RepairServiceApiService, public dialog: MatDialog, private responsive: BreakpointObserver) {}

  public ngOnInit(): void {
    this.rsApiService
      .getAll()
      .pipe(takeUntil(this._destroy$))
      .subscribe((rs: RepairService[]) => {
        const grouped = _.groupBy(rs, 'theme');
        this.groupedServices = _.mapValues(grouped, (s: RepairService[]) => _.sortBy(s, 'name'));
        this.themes = _.keys(this.groupedServices);
      });

    this.responsive
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
      .pipe(takeUntil(this._destroy$))
      .subscribe((state: BreakpointState) => {
        const matchedBp = _.keys(state.breakpoints).filter((bp) => state.breakpoints[bp])[0];
        this.isXSmallBp = matchedBp === Breakpoints.XSmall;
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
  }

  public buy(service: RepairService): void {
    this.dialog.open(ContactFormComponent, { data: `${serviceThemeMapping[service.theme]} : ${service.name}` });
  }
}
