import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { mailToService } from 'src/app/shared/_services/mailTo.service';
import { MatDividerModule } from '@angular/material/divider';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectModule,
    TextFieldModule,
    MatDividerModule,
  ],
  providers: [mailToService],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent {
  public formGroup = new FormGroup({
    subject: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('+33', [Validators.required, Validators.pattern(/\+\d{2}( )?(\d( )?){9}/)]),
    content: new FormControl('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string | null,
    public dialogRef: MatDialogRef<ContactFormComponent>,
    private mailToService: mailToService,
    private snackBar: MatSnackBar,
  ) {
    if (this.data) {
      this.formGroup.controls.subject.setValue(this.data);
    }
  }

  public saveForm(): void {
    if (this.formGroup.errors) return;

    const subject = this.formGroup.value.subject as string;
    const firstName = this.formGroup.value.firstName as string;
    const lastName = this.formGroup.value.lastName as string;
    const email = this.formGroup.value.email as string;
    const phone = this.formGroup.value.phone as string;
    const content = this.formGroup.value.content as string;
    const payload = { subject, firstName, lastName, email, phone, content };

    this.mailToService.send(payload);
    this.snackBar.open('Prise de contact envoyée !', 'OK', { duration: 2000 });
    this.dialogRef.close();
  }
}
