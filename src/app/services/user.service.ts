import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, finalize} from 'rxjs/operators';
import {BehaviorSubject, of} from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userList: any[];
  public userListSubscription: BehaviorSubject<any[]>;
  public loadingUsers: boolean;
  private userLimit: number;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.loadingUsers = false;
    this.userLimit = 10;
    this.userList = [];
    this.userListSubscription = new BehaviorSubject<any[]>(this.userList);
    this.getUserList();
  }

  public getUserList(page: number = 1) {
    this.loadingUsers = true;
    return this.http.get(`users?_page=${page}&_limit=${this.userLimit}`)
      .pipe(
        catchError((error: any) => {
          console.log('USER FETCHING ERROR', error);
          this.snackBar.open('An error occurred while loading users', 'Close', {
            duration: 4000,
          });
          return of(this.userList);
        }), // if request errors out show an error message and return last value of userList
        finalize(() => this.loadingUsers = false) // stop loading if request completes or errors out
      )
      .subscribe((response: any) => {
        console.log(response);
        this.userList = response;
        this.userListSubscription.next(this.userList);
      });
  }

}
