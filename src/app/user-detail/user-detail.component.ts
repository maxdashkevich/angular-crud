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

  @Input() user: User;
  
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

  updateUser(name: string = this.updateUserControl.controls['name'].value, login: string = this.updateUserControl.controls['login'].value): void {
    name = name.trim();
    login = login.trim();

    this.userService.updateUser(this.id, {name, login} as User)
      .subscribe(user => {
        this.user = {...user};
      })

  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }
}
