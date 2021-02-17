import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Subscription} from 'rxjs';

import { User } from "../user.interface";
import { UserService } from "../user.service";

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
    ) { }

  ngOnInit(): void {
    this.createUserControl = new FormGroup({
      name: new FormControl('', [Validators.required]),
      role: new FormControl('user'),
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.createUserControl.controls['login'].statusChanges.subscribe(status => {
      console.log(status);
    })
  }

  createUserControl: FormGroup;

  subscriptions: Subscription[] = [];

  @Input() users: User[];

  addUser(name: string = this.createUserControl.controls['name'].value, role: string = this.createUserControl.controls['role'].value, login: string = this.createUserControl.controls['login'].value, password: string = this.createUserControl.controls['password'].value): void {
    name = name.trim();
    role = role.trim();
    login = login.trim();
    password = password.trim();

    if (!name || !login || !password) { return; }

    this.subscriptions.push(this.userService.addUser({name, role, login, password} as User)
      .subscribe(user => {
        this.users.push(user);
      }));
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }
}
