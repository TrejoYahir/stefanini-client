import {Component, OnDestroy} from '@angular/core';
import {UserService} from '../../services/user.service';
import {MatSnackBar} from '@angular/material';
import {PaginatedList} from '../../classes/paginated-list.class';
import {User} from '../../classes/user.class';
import {PostService} from '../../services/post.service';
import {MenuService} from '../../services/menu.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnDestroy {
  public userListSub: any;
  public userList: PaginatedList;

  constructor(
    public userService: UserService,
    private snackBar: MatSnackBar,
    private postService: PostService,
    private menuService: MenuService) {
    // Show a greetings message for the user
    this.snackBar.open('Welcome!', 'Close', {
      duration: 4000,
    });

    // Observe the user list for changes
    this.userListSub = userService.userListSubscription
      .subscribe((userList) => this.userList = userList);
  }

  ngOnDestroy() {
    // Unsubscribe on destroy to avoid stack overflows
    this.userListSub.unsubscribe();
  }

  public loadNextPage() {
    // add more content to userList
    this.userService.getUserList();
  }

  setUserFilter(user: User) {
    this.postService.selectedUser = user;
    this.menuService.toggleNav();
  }
}
