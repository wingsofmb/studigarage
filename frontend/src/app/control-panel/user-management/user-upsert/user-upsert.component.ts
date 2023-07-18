import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/data-layer/user/user.model';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { UserApiService } from 'src/data-layer/user/user-api.service';
import { strongPasswordValidator } from 'src/app/auth/_services/form-validator.directive';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-upsert',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSnackBarModule],
  providers: [UserApiService],
  templateUrl: './user-upsert.component.html',
  styleUrls: ['./user-upsert.component.scss'],
})
export class UserUpsertComponent implements OnInit {
  public isCreation = false;
  public errorCode: number | null = null;
  public userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, strongPasswordValidator()]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });
  private _destroy$: Subject<null> = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User | null,
    public dialogRef: MatDialogRef<UserUpsertComponent>,
    private userApiService: UserApiService,
    private snackBar: MatSnackBar,
  ) {}

  public ngOnInit(): void {
    this.isCreation = this.data === null;
    if (this.data !== null) {
      this.userForm.setValue({
        email: this.data.email,
        password: '',
        firstName: this.data.firstName,
        lastName: this.data.lastName,
      });
    }
  }

  public saveForm(): void {
    if (this.userForm.errors) return;

    const email = this.userForm.value.email as string;
    const password = this.userForm.value.password as string;
    const firstName = this.userForm.value.firstName as string;
    const lastName = this.userForm.value.lastName as string;
    const payload = { email, password, firstName, lastName };
    const upsert$ = this.data === null ? this.userApiService.create(payload) : this.userApiService.update(this.data?.id, payload);

    upsert$
      .pipe(
        takeUntil(this._destroy$),
        catchError((error) => {
          this.errorCode = +error.status;
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (!response) return;
        this.snackBar.open(this.data === null ? 'Utilisateur ajouté' : 'Utilisateur modifié', 'OK', { duration: 1000 });
        this.errorCode = null;
        this.dialogRef.close(response);
      });
  }
}
