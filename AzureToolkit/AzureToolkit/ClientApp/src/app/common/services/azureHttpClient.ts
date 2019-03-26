import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AzureHttpClient {

  constructor(private http: HttpClient) { }

  get(url: string, apiKey: string) {
    return this.http.get(url, {
      headers: new HttpHeaders()
        .set('Ocp-Apim-Subscription-Key', apiKey)
    });
  }

  post(url, apiKey, data) {
    return this.http.post(url, data, {
      headers: new HttpHeaders()
        .set('Ocp-Apim-Subscription-Key', apiKey)
    });
  }

}
