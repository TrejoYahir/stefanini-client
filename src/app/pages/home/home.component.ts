import {Component, OnDestroy, ViewChild} from '@angular/core';
import {PostService} from '../../services/post.service';
import {PaginatedList} from '../../classes/paginated-list.class';
import {MatPaginator, PageEvent} from '@angular/material';
import {User} from '../../classes/user.class';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {

  private subscriptions: Subscription;
  public postList: PaginatedList;
  public selectedUser: User;
  public pageSizeOptions: number[];
  public isMobile: boolean;

  @ViewChild('paginator', {static: false}) private pagination: MatPaginator;

  constructor(public postService: PostService) {
    this.subscriptions = new Subscription();
    this.isMobile = false;
    this.pageSizeOptions = [5, 10, 25, 100];

    const postListSub = this.postService.selectedUserSubscription
      .subscribe((selectedUser: User) => this.selectedUser = selectedUser);

    const selectedUserSub = this.postService.postListSubscription
      .subscribe((postList: PaginatedList) => this.postList = postList);

    this.subscriptions.add(postListSub);
    this.subscriptions.add(selectedUserSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onPageEvent($event: PageEvent) {
    console.log('page event', $event);
    this.postService.postLimit = $event.pageSize;
    this.postService.getPostList($event.pageIndex + 1);
  }

  togglePostsOrder(order: string) {
    this.postService.postOrder = order;
    this.pagination.pageIndex = 0;
    this.postService.getPostList();
  }

  removeSelectedUser() {
    this.postService.selectedUser = null;
  }
}
