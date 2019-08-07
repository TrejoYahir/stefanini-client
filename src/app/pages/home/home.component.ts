import {Component, OnDestroy} from '@angular/core';
import {PostService} from '../../services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {

  public postListSub: any;
  public postList: any[];

  constructor(public postService: PostService) {
    this.postListSub = this.postService.postListSubscription
      .subscribe((postList) => this.postList = postList);
  }

  ngOnDestroy() {
    this.postListSub.unsubscribe();
  }

}
