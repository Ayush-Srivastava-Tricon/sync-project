import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RoleInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const role:any = localStorage.getItem("role");
    const user_id:any = localStorage.getItem("user_id");

    const loginUrl = '/api/login'; 
    const homeUrl  = "/api/get_content";

    if (!req.url.endsWith(loginUrl) && !req.url.endsWith(homeUrl)) {
      const clonedRequest = req.clone({
        setHeaders: {
          Role: role,
          Userid:user_id,
        }
      });
      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }

}
