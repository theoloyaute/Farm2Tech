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
  cols: any[] = [];
  searchValue: string = '';

  constructor(
    private UsersService: UsersService
  ) { }

  ngOnInit(): void {
    this.UsersService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.cols = [
        {field: 'firstname', header: 'Prénom'},
        {field: 'name', header: 'Nom'},
        {field: 'email', header: 'Email'},
        {field: 'mobile', header: 'Téléphone'},
        {field: 'fix', header: 'Téléphone Fixe'},
      ];
    });
  }

  onInput(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value;

    if (this.searchValue != '') {
      if (/^\d+$/.test(this.searchValue)) {
        return;
      } else {
        this.UsersService.getUserBySearch(this.searchValue).subscribe((users: User[]) => {
          this.users = users;
        });
      }
    } else {
      this.UsersService.getUsers().subscribe((users: User[]) => {
        this.users = users;
      });
    }
  }

}
