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
    this.loadingUsers = false; // user loading indicator
    this.userLimit = 10; // default quantity of users
    this.userList = []; // this will be populated with users
    this.currentPage = 1; // default page

    // Create paginationList object with default values
    const data = new PaginatedList(this.userList, 10, this.userLimit, this.currentPage);

    // Create an observable subject for external components
    this.userListSubscription = new BehaviorSubject<PaginatedList>(data);

    this.getUserList(); // fetch users
  }

  public getUserList(page?: number ) {
    this.loadingUsers = true; // enable loading indicator

    /*
    * QUERY PARAMS LIST:
    * _page - index of requested page, starts at 1
    * _limit - number of posts to fetch
    * */

    return this.http.get(
      `users?_page=${page || this.currentPage}&_limit=${this.userLimit}`,
      {observe: 'response' // this allows me to easily access the response headers
      })
      .pipe(
        catchError((error: any) => {
          console.log('USER FETCHING ERROR', error);
          this.snackBar.open('An error occurred while loading users', 'Close', {
            duration: 4000,
          }); // if request fails let the user know
          return of({
            body: this.userList,
            headers: {
              'X-Total-Count': this.userList.length + this.userLimit
            } // set fallback values, this always gives the post the option to retry in case of error
          });
        }),
        finalize(() => this.loadingUsers = false) // stop loading if request completes or errors out
      )
      .subscribe((response: any) => {
        this.currentPage++;
        this.userList.push(...response.body);
        const totalCount = response.headers.get('X-Total-Count');  // this header contains the total count of requested items
        const data = new PaginatedList(this.userList, totalCount, this.userLimit, this.currentPage);
        this.userListSubscription.next(data); // update the observable for all the subscribed components to see
      });
  }

}
