import { HttpInterceptor, HttpRequest } from '@angular/common/http/';
import { HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

/*
* This interceptor allows the coder to omit writing or importing the api url every time in the service files
* */

@Injectable()
export class ServerHttpInterceptor implements HttpInterceptor {

  // Avoid adding the api server to assets or external urls
  private readonly urlExceptions: string[] = [
    'assets',
    'http',
    'https'
  ];

  private readonly server: string;

  constructor() {
    this.server = environment.apiUrl;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let usesStagingServer = true;

    // loop through exceptions to know if the request needs the api url
    for (const ex of this.urlExceptions) {
      if (req.url.match(ex)) {
        usesStagingServer = false;
        break;
      }
    }

    if (usesStagingServer) {
      // if needed add server url to request
      const newReq = req.clone({
        url: `${this.server}/${req.url}`
      });

      return next.handle(newReq);
    }

    return next.handle(req);
  }
}
