import {Component, OnInit} from '@angular/core';
import {User} from "../../models/users";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  users: User[] = [];
  constructor(private UsersService: UsersService) { }

  ngOnInit(): void {
    this.UsersService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      console.log(users);
    });
  }
}
