import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UserApiService } from 'src/data-layer/user/user-api.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { User } from 'src/data-layer/user/user.model';
import { MatButtonModule } from '@angular/material/button';
import { UserUpsertComponent } from 'src/app/control-panel/user-management/user-upsert/user-upsert.component';
import { UserRoles } from 'src/data-layer/user/role.enum';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatMenuModule, MatIconModule, MatButtonModule, MatDialogModule],
  providers: [UserApiService],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'role', 'action'];
  public dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  public userRoleMapping: { [key in UserRoles]: string } = {
    [UserRoles.ADMIN]: 'Admin.',
    [UserRoles.EMPLOYEE]: 'Salarié',
  };
  public UserRoles = UserRoles;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  private refresh$: Subject<null> = new Subject();
  private _destroy$: Subject<null> = new Subject();

  constructor(private userApiService: UserApiService, public dialog: MatDialog) {}

  public ngAfterViewInit() {
    this.refresh$
      .pipe(
        switchMap(() => this.userApiService.getAll({})),
        takeUntil(this._destroy$),
      )
      .subscribe((users: User[]) => {
        this.dataSource = new MatTableDataSource<User>(users);
        this.dataSource.paginator = this.paginator;
      });
    this.refresh$.next(null);
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
  }

  public getRole(role: UserRoles): string {
    return this.userRoleMapping[role];
  }

  public updateUser(user: User): void {
    const dialogRef = this.dialog.open(UserUpsertComponent, {
      data: user,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.refresh$.next(null));
  }

  public deleteUser(user: User): void {
    if (user.role === UserRoles.ADMIN) return;
    this.userApiService
      .delete(user.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.refresh$.next(null));
  }

  public createUser(): void {
    const dialogRef = this.dialog.open(UserUpsertComponent, {
      data: null,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.refresh$.next(null));
  }
}
