import { Injectable } from '@angular/core';
import { Tweet } from '../interfaces/tweet';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TweetService {
  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get(environment.ApiUrl + '/users/all');
  }

  getUsersByUsername(loginId: string) {
    return this.http.get(environment.ApiUrl + `/user/search/${loginId}`);
  }

  getAllTweetsByUsername(loginId: string) {
    return this.http.get(environment.ApiUrl + `/${loginId}`);
  }

  getAllTweets() {
    return this.http.get(environment.ApiUrl + '/all');
  }

  postTweet(tweet: Tweet, loginId: string) {
    return this.http.post(environment.ApiUrl + `/${loginId}/add`, tweet);
  }

  likeTweet(tweetId: string, loginId: string) {
    return this.http.put(
      environment.ApiUrl + `/${loginId}/like/${tweetId}`,
      null
    );
  }

  deleteTweet(tweetId: string, loginId: string) {
    return this.http.delete(
      environment.ApiUrl + `/${loginId}/delete/${tweetId}`
    );
  }

  updateTweet(tweet: Tweet, loginId: string) {
    return this.http.put(
      environment.ApiUrl + `/${loginId}/update/${tweet.tweetId}`,
      tweet
    );
  }

  replyTweet(tweetId: string, tweet: Tweet, loginId: string) {
    return this.http.post(
      environment.ApiUrl + `/${loginId}/reply/${tweetId}`,
      tweet
    );
  }
}
