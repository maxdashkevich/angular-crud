import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from "../user.interface";
import { UserService } from "../user.service";

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
    ) { }

  ngOnInit(): void {}

  @Input() users: User[];

  add(name: string, role: string, login: string, password: string): void {
    name = name.trim();
    role = role.trim();
    login = login.trim();
    password = password.trim();

    if (!name || !login || !password) { return; }

    this.userService.addUser({name, role, login, password} as User)
      .subscribe(user => {
        this.users.push(user);
      });
  }

  goBack(): void {
    this.location.back();
  }
}
