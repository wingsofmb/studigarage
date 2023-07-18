import { AfterViewInit, Component, OnDestroy, TrackByFunction, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RepairServiceApiService } from 'src/data-layer/repair-service/repair-service-api.service';
import { RepairService } from 'src/data-layer/repair-service/repair-service.model';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';
import { serviceThemeMapping } from 'src/data-layer/repair-service/repair-service-mapping';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RSUpsertComponent } from 'src/app/control-panel/repair-service-management/rs-upsert/rs-upsert.component';

@Component({
  selector: 'app-repair-service-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [RepairServiceApiService],
  templateUrl: './repair-service-management.component.html',
  styleUrls: ['./repair-service-management.component.scss'],
})
export class RepairServiceManagementComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['theme', 'name', 'price', 'action'];
  public dataSource: MatTableDataSource<RepairService> = new MatTableDataSource<RepairService>([]);
  public themeMapping = serviceThemeMapping;
  public searchBar = new FormControl('');
  public trackByFunction: TrackByFunction<RepairService> = (index: number, item: RepairService) => item.id;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  private refresh$: Subject<null> = new Subject();
  private _destroy$: Subject<null> = new Subject();

  constructor(private rsApiService: RepairServiceApiService, public dialog: MatDialog) {}

  public ngAfterViewInit() {
    const data$ = this.refresh$.pipe(
      switchMap(() => this.rsApiService.getAll()),
      takeUntil(this._destroy$),
    );

    const filter$ = new BehaviorSubject<string | null>('');
    this.searchBar.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(filter$);

    filter$.pipe(takeUntil(this._destroy$)).subscribe((filter: string | null) => {
      if (!this.dataSource) return;
      this.dataSource.filter = filter ?? '';
    });

    data$.pipe(takeUntil(this._destroy$)).subscribe((rs: RepairService[]) => {
      this.dataSource = new MatTableDataSource<RepairService>(rs);
      this.dataSource.paginator = this.paginator;
    });
    this.refresh$.next(null);
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
  }

  public deleteRS(rs: RepairService): void {
    this.rsApiService
      .delete(rs.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.refresh$.next(null));
  }

  public createRS(): void {
    const dialogRef = this.dialog.open(RSUpsertComponent);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.refresh$.next(null));
  }
}
