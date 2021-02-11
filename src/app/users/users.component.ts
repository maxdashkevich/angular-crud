import { Component, Input, OnInit } from '@angular/core';

import { User } from "../user.interface";
import { UserService } from "../user.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  users: User[];

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => this.users = users);
  }

  delete(user: User): void {
    this.users = this.users.filter(h => h !== user);
    this.userService.deleteUser(user).subscribe();
  }
}
