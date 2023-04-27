import {Component, OnInit} from '@angular/core';
import {User} from "../../models/users";
import {UsersService} from "../../services/users.service";
import {AuthentificationService} from "../../services/authentification.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
    constructor(private UsersService: UsersService, private authService: AuthentificationService) { }

  ngOnInit(): void {
    this.UsersService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
    this.authService.isLoggedIn();
  }
}
