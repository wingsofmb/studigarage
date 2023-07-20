import { AfterViewInit, Component, Input, OnDestroy, TrackByFunction, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, Subject, combineLatest, debounceTime, map, switchMap, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ScoreComponent } from 'src/app/shared/score/score.component';
import { MatSelectModule } from '@angular/material/select';
import { Car } from 'src/data-layer/car/car.model';
import { CarApiService } from 'src/data-layer/car/car-api.service';
import { gearBoxMapping } from 'src/data-layer/car/gear-box-mapping';
import { energyTypeMapping } from 'src/data-layer/car/energy-type-mapping';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';
import * as _ from 'lodash';
import { CarGetAllStats, GetAllCarQP } from 'src/data-layer/car/car-api.dto';
import { MatSliderModule } from '@angular/material/slider';
import { GearBoxType } from 'src/data-layer/car/gear-box-type.enum';
import { EnergyType } from 'src/data-layer/car/energy-type.enum';
import { CarComponent } from 'src/app/shared/cars/car/car.component';
import { ResultAndStat } from 'src/data-layer/_shared/result-and-stat.model';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    ScoreComponent,
    MatSelectModule,
    MatSliderModule,
    CarComponent,
  ],
  providers: [CarApiService],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
})
export class CarListComponent implements AfterViewInit, OnDestroy {
  @Input()
  public isManagement = false;

  @Input()
  public set refreshRandom(value: number) {
    this.refresh$.next(null);
  }

  public cars: Car[] = [];
  public stats: CarGetAllStats = {
    count: 0,
    maxPriceLimit: Number.MAX_SAFE_INTEGER, // Prevent from messing with rendering
    maxMileageLimit: Number.MAX_SAFE_INTEGER,
    minCirculationDateLimit: 1900,
  };
  public limitFilter$: BehaviorSubject<number> = new BehaviorSubject<number>(10);
  public offsetFilter$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public minPriceFilter$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public maxPriceFilter$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public minMileageFilter$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public maxMileageFilter$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public minCirculationDateFilter$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public maxCirculationDateFilter$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public qFilter$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public gearBoxTypeFilter$: BehaviorSubject<GearBoxType | null> = new BehaviorSubject<GearBoxType | null>(null);
  public energyTypeFilter$: BehaviorSubject<EnergyType | null> = new BehaviorSubject<EnergyType | null>(null);

  public searchBar = new FormControl('');
  public minPriceSlider = new FormControl(null);
  public maxPriceSlider = new FormControl(null);
  public minMileageSlider = new FormControl(null);
  public maxMileageSlider = new FormControl(null);
  public minCirculationDateSlider = new FormControl(null);
  public maxCirculationDateSlider = new FormControl(null);
  public gearBoxTypeSelect = new FormControl('ALL');
  public energyTypeSelect = new FormControl('ALL');
  public now = new Date();
  public trackByFunction: TrackByFunction<Car> = (index: number, item: Car) => item.id;
  public GearBoxType = GearBoxType;
  public gearBoxKeys = _.keys(GearBoxType);
  public gearBoxMapping = gearBoxMapping;
  public EnergyType = EnergyType;
  public energyTypeKeys = _.keys(EnergyType);
  public energyTypeMapping = energyTypeMapping;

  public matchedBp = '';
  public breakpoints = Breakpoints;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  private refresh$: Subject<null> = new Subject();
  private _destroy$: Subject<null> = new Subject();

  constructor(private carApiService: CarApiService, private responsive: BreakpointObserver) {
    this.searchBar.valueChanges.pipe(debounceTime(500)).subscribe(this.qFilter$);
    this.minPriceSlider.valueChanges.pipe(debounceTime(200)).subscribe(this.minPriceFilter$);
    this.maxPriceSlider.valueChanges.pipe(debounceTime(200)).subscribe(this.maxPriceFilter$);
    this.minMileageSlider.valueChanges.pipe(debounceTime(200)).subscribe(this.minMileageFilter$);
    this.maxMileageSlider.valueChanges.pipe(debounceTime(200)).subscribe(this.maxMileageFilter$);
    this.minCirculationDateSlider.valueChanges.pipe(debounceTime(200)).subscribe(this.minCirculationDateFilter$);
    this.maxCirculationDateSlider.valueChanges.pipe(debounceTime(200)).subscribe(this.maxCirculationDateFilter$);
    this.gearBoxTypeSelect.valueChanges.pipe(map((v: unknown) => (v === 'ALL' ? null : v) as GearBoxType)).subscribe(this.gearBoxTypeFilter$);
    this.energyTypeSelect.valueChanges.pipe(map((v: unknown) => (v === 'ALL' ? null : v) as EnergyType)).subscribe(this.energyTypeFilter$);

    this.carApiService
      .getAllStats()
      .pipe(takeUntil(this._destroy$))
      .subscribe((stats: CarGetAllStats) => (this.stats = stats));

    this.responsive
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
      .pipe(takeUntil(this._destroy$))
      .subscribe((state: BreakpointState) => {
        this.matchedBp = _.keys(state.breakpoints).filter((bp) => state.breakpoints[bp])[0];
      });

    const filters = [
      this.qFilter$,
      this.limitFilter$,
      this.offsetFilter$,
      this.minPriceFilter$,
      this.maxPriceFilter$,
      this.minMileageFilter$,
      this.maxMileageFilter$,
      this.minCirculationDateFilter$,
      this.maxCirculationDateFilter$,
      this.gearBoxTypeFilter$,
      this.energyTypeFilter$,
    ];
    combineLatest([...filters, this.refresh$])
      .pipe(
        takeUntil(this._destroy$),
        map(([q, limit, offset, minPrice, maxPrice, minMileage, maxMileage, minCirculationDate, maxCirculationDate, gearBox, energy]) => ({
          q,
          limit,
          offset,
          minPrice,
          maxPrice,
          minMileage,
          maxMileage,
          minCirculationDate,
          maxCirculationDate,
          gearBox,
          energy,
        })),
        map((qp) => _.omitBy(qp, (x) => _.isNil(x) || _.isNaN(x)) as GetAllCarQP),
        switchMap((qp: GetAllCarQP) => this.carApiService.getAll(qp)),
        takeUntil(this._destroy$),
      )
      .subscribe((resultAndStats: ResultAndStat<Car[], CarGetAllStats>) => {
        this.cars = resultAndStats.result;
        // Beware of changing all stats object. It will reset itself loosing context
        this.stats.count = resultAndStats.stats.count;
      });
  }

  public ngAfterViewInit() {
    this.paginator?.page.pipe(takeUntil(this._destroy$)).subscribe((pageEvent: PageEvent) => {
      if (pageEvent.pageSize !== this.limitFilter$.value) this.limitFilter$.next(pageEvent.pageSize);
      if (pageEvent.pageIndex !== this.offsetFilter$.value) this.offsetFilter$.next(pageEvent.pageIndex);
    });
    this.refresh$.next(null);
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
  }

  public createCar(): void {
    console.log('CreateCar');
  }

  public carDetail(car: Car): void {
    console.log('carDetail', car);
  }
}
