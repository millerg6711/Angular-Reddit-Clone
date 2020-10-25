import {Component, OnInit} from '@angular/core';
import {PostModel} from '../shared/post-model';
import {PostService} from '../shared/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: PostModel[] = [];
  faArrowUp: any;
  faArrowDown: any;
  downvoteColor: any;
  upvoteColor: any;

  constructor(
    private postService: PostService
  ) {
    postService
      .getAllPosts()
      .subscribe((posts: PostModel[]) => {
        this.posts = posts;
      });
  }

  ngOnInit(): void {
  }

  upvotePost(): void {

  }
}
