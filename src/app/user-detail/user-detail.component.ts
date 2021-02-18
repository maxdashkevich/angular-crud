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

  user: User;

  updateUserControl: FormGroup;
  subscriptions: Subscription[] = [];
  selectedFile: File = null;

  private id: number;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.getUser();
  }

  onFileSelected(event): void {
    this.selectedFile = <File>event.target.files[0];
  }

  private initForm(): void {
    this.updateUserControl = new FormGroup({
      name: new FormControl(this.user.name),
      login: new FormControl(this.user.login)
  })
  }

  onUpload(): void {
    const fd = new FormData();

    fd.append('avatar', this.selectedFile, this.selectedFile.name);

    this.subscriptions.push(this.userService.addAvatar(fd, this.id)
      .subscribe(res => {
        alert('Photo successfully uploaded!')
      }));
  }

  getUser(): void {
    this.subscriptions.push(this.userService.getUser(this.id)
      .subscribe(user => {
       this.user = user;
       this.initForm();
    }));

  }

  updateUser(): void {
    const user: User = this.updateUserControl.value;

    this.subscriptions.push(
      this.userService.updateUser(this.id, user)
      .subscribe((user: User) => {
        this.user.name = user.name;
        this.user.login = user.login;
      })
    );
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }
}
