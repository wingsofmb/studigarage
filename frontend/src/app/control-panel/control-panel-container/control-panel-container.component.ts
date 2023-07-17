import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarLink } from 'src/app/shared/_models/navbar-links';
import { RolesService } from 'src/app/auth/_services/roles.service';

@Component({
  selector: 'app-control-panel-container',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, MatIconModule],
  templateUrl: './control-panel-container.component.html',
  styleUrls: ['./control-panel-container.component.scss'],
})
export class ControlPanelContainerComponent {
  public tabs: NavbarLink[];

  // private _destroy$: Subject<null> = new Subject();

  constructor(private rolesService: RolesService) {
    const adminTabs: NavbarLink[] = [
      { link: 'car-management', label: 'Annonces', icon: 'directions_car' },
      { link: 'user-management', label: 'Utilisateurs', icon: 'person' },
    ];
    const employeeTabs: NavbarLink[] = [{ link: 'car-management', label: 'Annonces', icon: 'directions_car' }];
    this.tabs = this.rolesService.isAdmin() ? adminTabs : employeeTabs;
  }
}
