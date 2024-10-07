import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { AuthService } from './service/auth.service';
import { BaseService } from './service/base.service';
import { HeaderModule } from './component/header/header.module';
import { HashLocationStrategy,LocationStrategy } from '@angular/common';
import { RoleInterceptor } from './role.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HeaderModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, AuthService, BaseService,
     {
    provide: HTTP_INTERCEPTORS,
    useClass: RoleInterceptor,
    multi: true
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
