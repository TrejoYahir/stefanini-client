import {Component, OnDestroy} from '@angular/core';
import {UserService} from '../../services/user.service';
import {MatSnackBar} from '@angular/material';
import {PaginatedList} from '../../classes/paginated-list.class';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnDestroy {
  public userListSub: any;
  public userList: PaginatedList;

  constructor(public userService: UserService, private snackBar: MatSnackBar) {
    this.snackBar.open('Welcome again', 'Close', {
      duration: 4000,
    });
    this.userListSub = userService.userListSubscription
      .subscribe((userList) => this.userList = userList);
  }

  ngOnDestroy() {
    this.userListSub.unsubscribe();
  }

  public loadNextPage() {
    this.userService.getUserList();
  }
}
