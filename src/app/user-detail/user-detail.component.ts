import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

import { User } from "../user.interface";
import { UserService } from "../user.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  @Input() user: User;

  updateUserControl: FormGroup = new FormGroup({
    name: new FormControl(),
    login: new FormControl()
  });

  subscriptions: Subscription[] = [];

  selectedFile: File = null;

  onFileSelected(event): void {
    this.selectedFile = <File>event.target.files[0];
  }

  onUpload(): void {
    const fd = new FormData();
    const id = +this.route.snapshot.paramMap.get('id');

    fd.append('avatar', this.selectedFile, this.selectedFile.name);

    this.subscriptions.push(this.userService.addAvatar(fd, id)
      .subscribe(res => {
        alert('Photo successfully uploaded!')
      }));
  }

  getUser(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.userService.getUser(id)
      .subscribe(user => this.user = user));
  }

  updateUser(name: string = this.updateUserControl.controls['name'].value, login: string = this.updateUserControl.controls['login'].value): void {
    const id = +this.route.snapshot.paramMap.get('id');
    name = name.trim();
    login = login.trim();

    this.userService.updateUser(id, {name, login} as User)
      .subscribe(user => {
        this.user.name = user.name;
        this.user.login = user.login;
      })

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
