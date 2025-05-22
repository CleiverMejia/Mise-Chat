import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '@services/storage/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.storageService.get('accessToken');

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: token,
        },
      });

      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
