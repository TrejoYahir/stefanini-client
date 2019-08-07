import { Injectable } from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {catchError, finalize} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  public postList: any[];
  public postListSubscription: BehaviorSubject<any[]>;
  public loadingPosts: boolean;
  private readonly postLimit: number;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.loadingPosts = false;
    this.postLimit = 10;
    this.postList = [];
    this.postListSubscription = new BehaviorSubject<any[]>(this.postList);
    this.getPostList();
  }

  public getPostList(page: number = 1) {
    this.loadingPosts = true;
    return this.http.get(`posts?_page=${page}&_limit=${this.postLimit}`)
      .pipe(
        catchError((error: any) => {
          console.log('POSTS FETCHING ERROR', error);
          this.snackBar.open('An error occurred while loading user posts', 'Close', {
            duration: 4000,
          });
          return of(this.postList);
        }), // if request errors out show an error message and return last value of userList
        finalize(() => this.loadingPosts = false) // stop loading if request completes or errors out
      )
      .subscribe((response: any) => {
        console.log(response);
        this.postList = response;
        this.postListSubscription.next(this.postList);
      });
  }
}
