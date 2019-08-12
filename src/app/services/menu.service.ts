import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public navSubscription: BehaviorSubject<string>;

  constructor() {
    this.navSubscription = new BehaviorSubject<string>(null);
  }

  toggleNav() {
    this.navSubscription.next('toggle');
  }
}
