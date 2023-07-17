import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthApiService } from 'src/data-layer/auth/auth-api.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Subject, catchError, of, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  providers: [AuthApiService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public loginErrorCode: number | null = null;

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  private _destroy$: Subject<null> = new Subject();

  constructor(private authApiService: AuthApiService, private router: Router) {}

  public submitForm(): void {
    if (this.loginForm.errors) return;

    const email = this.loginForm.value.email as string;
    const password = this.loginForm.value.password as string;
    const login$ = this.authApiService.login(email, password).pipe(takeUntil(this._destroy$));

    login$
      .pipe(
        catchError((error) => {
          this.loginErrorCode = +error.status;
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response) this.router.navigate(['/setting']);
      });
  }
}
