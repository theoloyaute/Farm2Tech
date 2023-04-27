import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthentificationService} from "../../services/authentification.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  email = '';
  password = '';
  userFormGroup! : FormGroup;
  errorMessage!: string;

  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.userFormGroup = this.fb.group({
      email : this.fb.control(""),
      password : this.fb.control("")
    });
  }

  login() {
    this.email = this.userFormGroup.value.email;
    this.password = this.userFormGroup.value.password;
    this.authService.login(this.email, this.password).subscribe(result => {
      this.router.navigate(['/']);
    }, (error: HttpErrorResponse) => {
      if (error.status == 404) {
        this.errorMessage = "Email ou mot de passe incorrect !";
      }
    });
  }
}
