import { Component } from '@angular/core';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent {
  newPost = "NO CONTENT";

  onAddPost(inputPost: HTMLTextAreaElement) {
    this.newPost = inputPost.value
  }
}
