import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './pages/users/users.component';
import {UsersService} from "./services/users.service";
import {HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './pages/login/login.component';
import {CheckboxModule} from "primeng/checkbox";
import {StyleClassModule} from 'primeng/styleclass';
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {ReactiveFormsModule} from "@angular/forms";
import {PaginatorModule} from "primeng/paginator";
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import {TableModule} from "primeng/table";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CheckboxModule,
    StyleClassModule,
    ButtonModule,
    DividerModule,
    ReactiveFormsModule,
    PaginatorModule,
    TableModule,
    InputSwitchModule,
    InputTextModule,
    PasswordModule
  ],
  providers: [UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
