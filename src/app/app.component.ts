import {Component, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subscription} from 'rxjs';
import {MenuService} from './services/menu.service';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public isMobile: boolean;
  private navSubscription: Subscription;
  @ViewChild('nav', {static: false}) private nav: MatSidenav;

  constructor(private breakPointObserver: BreakpointObserver, private menuService: MenuService) {
    this.breakPointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });

    this.navSubscription = this.menuService.navSubscription
      .subscribe((message: string) => {
        if (message === 'toggle') {
          this.nav.toggle();
        }
      });
  }
}
