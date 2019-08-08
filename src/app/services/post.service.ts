import { Injectable } from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {catchError, finalize} from 'rxjs/operators';
import {PaginatedList} from '../classes/paginated-list.class';
import {Post} from '../classes/post.class';
import {User} from '../classes/user.class';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  public postList: Post[];
  public postListSubscription: BehaviorSubject<PaginatedList>;

  // tslint:disable-next-line:variable-name
  public _selectedUser: User;
  public selectedUserSubscription: BehaviorSubject<User>;

  public loadingPosts: boolean;
  public postOrder: string;
  public postLimit: number;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.postLimit = 10; // default quantity of posts
    this.postList = []; // this will be populated with posts
    this.loadingPosts = false;  // loading indicator
    this.postOrder = 'DESC'; // default posts order

    // Create paginationList object with default values
    const data = new PaginatedList(this.postList, 10, this.postLimit, 1);

    // Create a postList observable subject for external components
    this.postListSubscription = new BehaviorSubject<PaginatedList>(data);

    // Start without a selected user
    this.selectedUserSubscription = new BehaviorSubject<User>(null);

    this.getPostList(); // fetch posts
  }

  // Update observable when a selected user is set
  set selectedUser(user: User) {
    this._selectedUser = user;
    this.selectedUserSubscription.next(this._selectedUser);
    this.getPostList();
  }

  public getPostList(page: number = 1) {
    this.loadingPosts = true; // enable loading indicator

    let postFilter = '';

    // if the user clocked on another user profile filter the requests by user id
    if (this._selectedUser !== undefined && this._selectedUser !== null) {
      postFilter = `&userId=${this._selectedUser.id}`;
    }

    /*
    * QUERY PARAMS LIST:
    * _page - index of requested page, starts at 1
    * _limit - number of posts to fetch
    * _expand - name of parent object, this includes the parent object as a field
    * _sort - name of sorting field
    * _order - ASC or DESC
    * */

    return this.http.get(
      `posts?_page=${page}&_limit=${this.postLimit}&_expand=user&_sort=date&_order=${this.postOrder}${postFilter}`,
      {observe: 'response' // this allows me to easily access the response headers
      })
      .pipe(
        catchError((error: any) => {
          console.log('USER FETCHING ERROR', error);
          this.snackBar.open('An error occurred while loading posts', 'Close', {
            duration: 4000,
          }); // if request fails let the user know
          return of({
            body: this.postList,
            headers: {
              'X-Total-Count': this.postList.length + this.postLimit
            } // set fallback values, this always gives the post the option to retry in case of error
          });
        }),
        finalize(() => this.loadingPosts = false) // toggle loading indicator if request completes or errors out
      )
      .subscribe((response: any) => {
        this.postList = response.body;
        const totalCount = response.headers.get('X-Total-Count'); // this header contains the total count of requested items
        const data = new PaginatedList(this.postList, totalCount, this.postLimit, page);
        this.postListSubscription.next(data); // update the observable for all the subscribed components to see
      });
  }
}
