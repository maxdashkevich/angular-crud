import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from "../user.interface";
import { UserService } from "../user.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  subscriptions: Subscription[] = [];

  users: User[];

  getUsers(): void {
    this.subscriptions.push(this.userService.getUsers()
      .subscribe(users => this.users = users));
  }

  delete(user: User): void {
    this.users = this.users.filter(h => h !== user);
    this.subscriptions.push(this.userService.deleteUser(user).subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }
}
