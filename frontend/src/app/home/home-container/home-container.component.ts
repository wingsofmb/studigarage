import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { NavbarLink } from 'src/app/shared/_models/navbar-links';
import { AuthService } from 'src/app/auth/_services/auth.service';
import { BehaviorSubject, Observable, Subject, filter, map, takeUntil, tap } from 'rxjs';
import * as _ from 'lodash';
import { Setting } from 'src/data-layer/setting/setting.model';
import { SettingApiService } from 'src/data-layer/setting/setting-api.service';

@Component({
  selector: 'app-home-container',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTabsModule, MatIconModule],
  providers: [SettingApiService],
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.scss'],
})
export class HomeContainerComponent implements OnInit, OnDestroy {
  public tabs$: Observable<NavbarLink[]>;
  public activeLink$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public setting: Setting | null = null;

  private _destroy$: Subject<null> = new Subject();

  constructor(
    private authService: AuthService,
    private settingApiService: SettingApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    const publicTabs: NavbarLink[] = [
      { link: 'home', label: 'Accueil', icon: 'home' },
      { link: 'offers', label: 'Annonces' },
      { link: 'contact', label: 'Nous contacter' },
    ];
    const authTabs: NavbarLink[] = [{ link: 'auth/login', label: 'Connexion', icon: 'login' }];
    const privateTabs: NavbarLink[] = [
      { link: 'control-panel', label: 'Gestion', icon: 'settings' },
      { link: 'auth/logout', label: 'Déconnexion', icon: 'logout' },
    ];
    this.tabs$ = this.authService.isLogged$.pipe(
      map((isLogged: boolean) => (isLogged ? _.concat(publicTabs, privateTabs) : _.concat(publicTabs, authTabs))),
      takeUntil(this._destroy$),
    );
  }

  public ngOnInit(): void {
    // Listen on routing changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => (event as NavigationEnd).urlAfterRedirects.slice(1)),
        map((path: string) => path.split('/')[0]),
        takeUntil(this._destroy$),
      )
      .subscribe((x) => this.activeLink$.next(x));

    this.activeLink$
      .pipe(
        takeUntil(this._destroy$),
        tap(() => this.cdr.detectChanges()),
      )
      .subscribe();

    this.activeLink$.next(this.router.url.slice(1).split('/')[0]);

    this.settingApiService
      .get()
      .pipe(takeUntil(this._destroy$))
      .subscribe((setting: Setting) => (this.setting = setting));
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
  }
}
