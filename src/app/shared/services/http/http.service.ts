import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { SendNotification } from '@interfaces/sendNotification.interface';
import { TokenResponse } from '@interfaces/tokenResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly credentials = environment.credentials
  private readonly urlToken = environment.urlToken;
  private readonly urlNotification = environment.urlNotification;

  constructor(private http: HttpClient) { }

  public getToken() {
    return this.http.post<TokenResponse>(this.urlToken, this.credentials)
  }

  public sendNotification(notification: SendNotification) {
    console.log(notification);

    return this.http.post<SendNotification>(this.urlNotification, notification)
  }
}