import {Component, OnInit} from '@angular/core';
import {User} from "../../models/users";
import {UsersService} from "../../services/users.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  user : User | undefined;
  formGroup!: FormGroup;
  errorMessage!: string;

    constructor(
      private UsersService: UsersService,
      private route: ActivatedRoute,
      private router: Router
    ) {}

  ngOnInit(): void {
      if (!this.UsersService.isLogged()) {
        alert('Vous devez vous connecter pour accéder à cette page');
        this.router.navigate(['/']);
      }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.UsersService.getUserById(id).subscribe((user: User) => {
      this.user = user;
    });
    this.formGroup = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fix: new FormControl(''),
      mobile: new FormControl('', [Validators.required]),
      password: new FormControl(''),
      isadmin: new FormControl(''),
      serviceId: new FormControl('', [Validators.required]),
    });
  }

  editUser() {
      const user = {
        id: this.user?.id,
        firstname: this.formGroup.value.firstname == '' ? this.user?.firstname : this.formGroup.value.firstname,
        lastname: this.formGroup.value.lastname == '' ? this.user?.lastname : this.formGroup.value.lastname,
        email: this.formGroup.value.email == '' ? this.user?.email : this.formGroup.value.email,
        fix: this.formGroup.value.fix == '' ? this.user?.fix : this.formGroup.value.fix,
        mobile: this.formGroup.value.mobile == '' ? this.user?.mobile : this.formGroup.value.mobile,
        password: this.formGroup.value.password == '' ? this.user?.password : this.formGroup.value.password,
        isadmin: this.formGroup.value.isadmin == '' ? this.user?.isadmin : this.formGroup.value.isadmin,
        serviceId: this.formGroup.value.serviceId == '' ? this.user?.serviceId : this.formGroup.value.serviceId,
      }

      this.UsersService.update(user).subscribe(result => {
        this.router.navigate(['/']);
      }, (error: HttpErrorResponse) => {
        if (error.status == 404) {
          this.errorMessage = "Erreur de modification !";
        }
      });
  }

  deleteUser(id: any) {
    this.UsersService.delete(id).subscribe(result => {
      this.router.navigate(['/']);
    }, (error: HttpErrorResponse) => {
      if (error.status == 404) {
        this.errorMessage = "Erreur de suppression !";
      }
      if (error.status == 500) {
        this.errorMessage = "Vous ne pouvez pas le supprimer !";
      }
    });
  }
}
