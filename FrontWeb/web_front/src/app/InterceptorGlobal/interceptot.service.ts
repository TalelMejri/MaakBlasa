import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptotService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var userName=localStorage.getItem('token');
    let final_request;
    if(userName){
      final_request = req.clone(
        {
          setHeaders: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + userName
          },
        }
      );
    }else{
      final_request = req.clone(
        {
          setHeaders: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return next.handle(final_request);
  }
}
