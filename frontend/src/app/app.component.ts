import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/auth/_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HttpClientModule, RouterModule],
})
export class AppComponent implements OnInit {
  title = 'studifront';

  constructor(private authService: AuthService) {}

  public ngOnInit(): void {
    this.authService.restoreProfileIfExist();
  }
}
