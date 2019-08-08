import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../classes/post.class';
import {PostService} from '../../services/post.service';
import {User} from '../../classes/user.class';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() public post: Post;

  constructor(private postService: PostService) {}

  ngOnInit() {
  }

  setUserFilter(user: User) {
    this.postService.selectedUser = user;
  }
}
