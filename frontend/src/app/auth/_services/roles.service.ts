import { Injectable } from '@angular/core';
import { UserRoles } from 'src/data-layer/user/role.enum';
import { AuthService } from 'src/app/auth/_services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private authService: AuthService) {}

  public getRole(): UserRoles | null {
    if (!this.authService.userProfile) return null;
    return this.authService.userProfile.role;
  }

  public isEmployee(): boolean {
    const role = this.getRole();
    return role === UserRoles.EMPLOYEE;
  }

  public isAdmin(): boolean {
    const role = this.getRole();
    return role === UserRoles.ADMIN;
  }
}
