import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  Form,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user';
import { Tweet } from '../interfaces/tweet';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TweetService } from '../services/tweet.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

declare var $: any;

@Component({
  selector: 'app-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.css'],
})
export class TweetListComponent implements OnInit {
  tweetForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  editSubmitted: boolean = false;
  replySubmitted: boolean = false;
  currentUser: User;
  tweetList: Tweet[] = [];
  replyTweetForm: FormGroup;
  editTweetForm: FormGroup;
  tweetText: string;
  flag: boolean = false;
  invalid: boolean = false;
  currentTweet: Tweet = {
    tweetId: null,
    tweetMsg: null,
    postTime: null,
    likes: 0,
    user: null,
    replies: null,
    tweetTag: null,
  };
  addTagClicked: boolean = false;
  currentRouteUsername: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private tweetService: TweetService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }


  addTag() {
    this.addTagClicked = true;
  }


  removeTag() {
    this.addTagClicked = false;
  }

  likeTweet(tweetId: string) {
    this.tweetService
      .likeTweet(tweetId, this.currentUser.loginId)
      .subscribe((data: any) => {
        this.refreshTweets();
      });
  }

  deleteTweet(tweetId: string) {
    this.tweetService
      .deleteTweet(tweetId, this.currentUser.loginId)
      .subscribe((data: any) => this.refreshTweets());
  }


  openEditTweetPopup(tweet: Tweet) {
    this.currentTweet = tweet;
    console.log("current tweet:", this.currentTweet);
    console.log("tweet: ", tweet);
    $('#editModal').appendTo("body").modal('show');
  }


  openReplyTweetPopup(tweet: Tweet) {
    this.currentTweet = tweet;
    $('#replyModal').appendTo("body").modal('show');
  }

  editTweetSubmit() {
    this.editSubmitted = true;
    this.currentTweet.tweetMsg = this.editTweetForm.controls.tweetBody.value;
    this.tweetService
      .updateTweet(this.currentTweet, this.currentUser.loginId)
      .subscribe((data: any) => {
        this.refreshTweets();
        this.currentTweet = {
          tweetId: null,
          tweetMsg: null,
          postTime: null,
          likes: 0,
          user: null,
          replies: null,
          tweetTag: null,
        };
        $('#editModal').modal('hide');
        this.addTagClicked = false;
      });
  }

  replyTweetSubmit() {
    this.replySubmitted = true;
    let now = new Date();
    let replyTweet: Tweet = {
      tweetId: null,
      tweetMsg: this.replyTweetForm.controls.tweetBody.value,
      postTime: new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      ).toISOString(),
      likes: null,
      user: this.currentUser,
      replies: null,
      tweetTag: this.replyTweetForm.controls.tweetTag.value,
    };
    console.log(replyTweet.user);
    this.tweetService
      .replyTweet(this.currentTweet.tweetId, replyTweet, this.currentUser.loginId)
      .subscribe((data: any) => {
        this.refreshTweets();
        this.currentTweet = {
          tweetId: null,
          tweetMsg: null,
          postTime: null,
          likes: 0,
          user: null,
          replies: null,
          tweetTag: null,
        };
        $('#replyModal').modal('hide');
        this.addTagClicked = false;
      });
  }

  refreshTweets() {
    this.tweetList.splice(0);
    if (this.currentRouteUsername === null) {
      this.tweetService.getAllTweets().subscribe((data: any) => {
        this.tweetList.push(...data);
      });
    } else {
      this.tweetService
        .getAllTweetsByUsername(this.currentRouteUsername)
        .subscribe((data: any) => {
          this.tweetList.push(...data);
        });
    }
    console.log(this.tweetList);
  }


  handleClear() {
    this.tweetText = '';
  }

  onSubmit() {
    this.submitted = true;
    if (this.tweetForm.invalid) {
      return;
    }
    this.loading = true;
    let tweet: Tweet = {
      tweetId: null,
      tweetMsg: this.f.tweetBody.value,
      postTime: null,
      likes: 0,
      user: null,
      replies: [],
      tweetTag: this.f.tweetTag.value,
    };
    this.tweetService.postTweet(tweet, this.currentUser.loginId).subscribe(
      (data: any) => {
        if (data.tweetId !== undefined) {
          this.refreshTweets();
          console.log(this.tweetList);
          this.addTagClicked = false;

        }
        this.loading = false;
        this.invalid=true;
      },
      (err) => {
        this.loading = false;
        this.invalid = true;
      }
    );
    this.tweetText = ' ';
    console.log('x');
  }

  trackTweet(index: number, tweet: Tweet) {
    return tweet.tweetId;
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('login');
    }
    this.currentUser = this.authService.getCurrentUser();
    this.tweetForm = this.formBuilder.group({
      tweetBody: ['', [Validators.required, Validators.maxLength(144)]],
      tweetTag: ['', Validators.maxLength(50)],
    });
    this.replyTweetForm = this.formBuilder.group({
      tweetBody: ['', [Validators.required, Validators.maxLength(144)]],
      tweetTag: ['', Validators.maxLength(50)],
    });
    this.editTweetForm = this.formBuilder.group({
      tweetBody: ['', [Validators.required, Validators.maxLength(144)]],
    });
    this.currentRouteUsername = this.route.snapshot.paramMap.get('loginId');
    if (this.currentRouteUsername === null) {
      this.tweetService.getAllTweets().subscribe((data: any) => {
        this.tweetList = data;
      });
    } else {
      this.tweetService
        .getAllTweetsByUsername(this.currentRouteUsername)
        .subscribe((data: any) => {
          this.tweetList = data;
          this.flag = true;
          $('#tweetPost').modal('hide');
        });
    }
  }

  get f() {
    return this.tweetForm.controls;
  }
}
