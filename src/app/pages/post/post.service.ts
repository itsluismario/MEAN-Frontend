// post.service.ts
import { Injectable } from '@angular/core';
import { TPost, TPostCreated, TMongoDBResponse,TPostResponse, TPostGetResponse } from './post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: TPost[] = [];
  private postsUpdated = new Subject<TPost[]>()

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{message: string, posts: TPost[]}>('http://localhost:3000/api/posts')
      .subscribe(response => {
        this.posts = response.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http.get<TPostGetResponse>('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: TPostCreated = { title, content };
    this.http
      .post<TPostResponse>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const createdPost: TPost = {
          id: responseData.postId,
          title: post.title,
          content: post.content
        };
        this.posts.push(createdPost);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: TPost = { id:id, title: title, content: content };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response =>
      {
        const updatedPost = [...this.posts];
        const oldPostIndex = updatedPost.findIndex(p => p.id === post.id);
        updatedPost[oldPostIndex] = post;
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      }
      );
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatePosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatePosts;
        this.postsUpdated.next([...this.posts]);
      })
  }

}
