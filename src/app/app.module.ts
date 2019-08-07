import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import {
  MatGridListModule,
  MatListModule,
  MatProgressSpinnerModule, MatRippleModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import { HeaderComponent } from './components/header/header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ServerHttpInterceptor} from './interceptors/server.interceptor';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatGridListModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatListModule,
    MatRippleModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerHttpInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
