import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private excludedUrls: string[] = ['/login', '/register'];

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isExcluded = this.excludedUrls.some((url) => req.url.includes(url));
    if (isExcluded) {
      return next.handle(req);
    }

    const token = localStorage.getItem('authTokenKey');
    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });
      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }
}
