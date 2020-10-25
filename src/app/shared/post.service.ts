import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PostModel} from './post-model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllPosts(): Observable<PostModel[]> {
    return this.httpClient.get<PostModel[]>('api/posts');
  }
}
