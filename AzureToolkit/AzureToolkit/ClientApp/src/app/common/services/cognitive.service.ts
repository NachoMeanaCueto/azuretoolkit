import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BingSearchResponse } from '../models/bingSearchResponse';
import { AzureHttpClient } from '../services/azureHttpClient';
import { ComputerVisionRequest, ComputerVisionResponse } from '../models/computerVisionResponse';
import { faceSearchRequest, faceSearchResponse } from '../models/faceSearchResponse';


@Injectable()
export class CognitiveService {

  bingSearchAPIKey = '3e89c5adec6f4ddaa5a6d7429b246cea';
  computerVisionAPIKey = 'd2686a1eda2342a18d17109e9e68111b';
  faceAPIKey = 'd13ad5bc79f94fd481cf2b5918d9b105';

  constructor(private http: AzureHttpClient)
  {
  }

  searchImages(searchTerm: string): Observable<BingSearchResponse> {
    return this.http.get(`https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${searchTerm}`, this.bingSearchAPIKey)
      .pipe(
        map(response => response)
       , catchError(this.handleError)
    ) as Observable<BingSearchResponse>;
  }

  analyzeImage(request: ComputerVisionRequest): Observable<ComputerVisionResponse> {
    return this.http.post('https://francecentral.api.cognitive.microsoft.com/vision/v2.0/analyze?visualFeatures=Description,Tags&language=es', this.computerVisionAPIKey, request)
      .pipe(
        map(response => response)
       , catchError(this.handleError)
    ) as Observable<ComputerVisionResponse>;
  }

  hasPerson(request: faceSearchRequest): Observable<faceSearchResponse> {
    return this.http.post('https://francecentral.api.cognitive.microsoft.com/face/v1.0/detect', this.faceAPIKey, request)
      .pipe(
        map(response => response)
        , catchError(this.handleError)
    ) as Observable<faceSearchResponse>;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
