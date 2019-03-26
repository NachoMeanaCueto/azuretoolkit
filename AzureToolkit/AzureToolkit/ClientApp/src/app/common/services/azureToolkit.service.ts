import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ImagePostRequest } from '../models/ImagePostRequest';
import { SavedImage } from '../models/SavedImage';


@Injectable()
export class AzureToolkitService {
  private originUrl: string;
  
  constructor(private http: HttpClient) {
    this.originUrl = window.location.origin;
  }

  public saveImage(imagePostRequest: ImagePostRequest): Observable<boolean> {

    return this.http.post(`${this.originUrl}/api/v1/images`, imagePostRequest)
      .pipe(
        map(response => { return true })
      , catchError(this.handleError)) as Observable<boolean>
  }

  public getImages(userId: string): Observable<SavedImage[]> {
    return this.http.get(`${this.originUrl}/api/v1/images/${userId}`)
      .pipe(
          map(resp => { return resp }),
          catchError(this.handleError) ) as Observable<SavedImage[]>
  }

  public searchImage(userId: string, searchTerm: string): Observable<SavedImage[]> {
    return this.http.get(`${this.originUrl}/api/v1/images/search/${userId}/${searchTerm}`)
      .pipe(resp => { return resp }, catchError(this.handleError)) as Observable<SavedImage[]>;
  }

  public getImagesWithPersons(userId: string): Observable<SavedImage[]> {
    return this.http.get(`${this.originUrl}/api/v1/images/searchPerson/${userId}`)
      .pipe(
        map(resp => { return resp }),
        catchError(this.handleError)) as Observable<SavedImage[]>
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
