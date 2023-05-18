import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { storage_keys } from './serviceUrls';
import { AppService } from './app.service';


@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(public router: Router,
        private apiService:AppService,
        private toaster: ToastrService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return this.sendRequest(req, next);

    }

    setParams(req: HttpRequest<any>) {

        let new_request: any = {};
        let token = localStorage.getItem(storage_keys.TOKEN);
        if(req.url == 'login'){
            var url =  environment.BASE_URL + req.url;
            new_request = req.clone({
                url: url,
                params: req.params,
                body: req.body,
            });
        }
        else{
            if (token) {
                var url =  environment.BASE_URL + req.url;
                new_request = req.clone({
                    url: url,
                    params: req.params,
                    body: req.body,
                    setHeaders: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            }
            else {
                this.toaster.error("token is missing.");
            }
        }
       
        return new_request;
    }

    sendRequest(
        req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        let newReq: any = this.setParams(req);

        let request = next.handle(newReq).pipe(
            tap(event => {
                if (event instanceof HttpErrorResponse) {
                    if (event.status == 401) {
                        this.toaster.error('Session expired');
                        this.apiService.logout();
                    }
                }
                return event;
            }),
            catchError(error => {
                if (error.status == 401) {
                    this.toaster.error('Session expired');
                    this.apiService.logout();
                }
                return throwError(() => error);
            })
        );
        return request;
    }
}
