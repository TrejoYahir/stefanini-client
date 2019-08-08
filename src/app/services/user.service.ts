import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, finalize} from 'rxjs/operators';
import {BehaviorSubject, of} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {PaginatedList} from '../classes/paginated-list.class';
import {User} from '../classes/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userList: User[];
  public userListSubscription: BehaviorSubject<PaginatedList>;
  public loadingUsers: boolean;
  private readonly userLimit: number;
  private currentPage: number;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.loadingUsers = false;
    this.userLimit = 10;
    this.userList = [];
    this.currentPage = 1;
    const data = new PaginatedList(this.userList, 10, this.userLimit, this.currentPage);
    this.userListSubscription = new BehaviorSubject<PaginatedList>(data);
    this.getUserList();
  }

  public getUserList(page?: number ) {
    this.loadingUsers = true;
    return this.http.get(
      `users?_page=${page || this.currentPage}&_limit=${this.userLimit}`,
      {observe: 'response'
      })
      .pipe(
        catchError((error: any) => {
          console.log('USER FETCHING ERROR', error);
          this.snackBar.open('An error occurred while loading users', 'Close', {
            duration: 4000,
          });
          return of({
            body: this.userList,
            headers: {
              'X-Total-Count': this.userList.length + this.userLimit
            } // this always gives the user the option to retry in case of error
          });
        }), // if request errors out show an error message and return last value of userList
        finalize(() => this.loadingUsers = false) // stop loading if request completes or errors out
      )
      .subscribe((response: any) => {
        console.log(response);
        this.currentPage++;
        this.userList.push(...response.body);
        const totalCount = response.headers.get('X-Total-Count');
        const data = new PaginatedList(this.userList, totalCount, this.userLimit, this.currentPage);
        this.userListSubscription.next(data);
        console.log('user list data', data);
      });
  }

}
