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

  addUser(): void {
    if (!this.createUserControl.valid) {
      return;
    }
    const user: User = this.createUserControl.value;

    this.subscriptions.push(
      this.userService.addUser(user)
        .subscribe((user: User) => {
          this.users.push(user);
        })
    );
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
