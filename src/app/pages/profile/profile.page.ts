import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@interfaces/user.interface';
import { StorageService } from '@services/storage/storage.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  public currentUser!: User;
  public profileForm!: FormGroup;
  public messageUpdate!: string;
  public isToastOpen: boolean = false;

  constructor(
    private storageService: StorageService,
    private form: FormBuilder,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  private loadUser() {
    this.currentUser = JSON.parse(this.storageService.get('currentUser'));

    this.profileForm = this.form.group({
      name: [this.currentUser?.name, Validators.required],
      lastname: [this.currentUser?.lastname, Validators.required],
    });
  }

  public onSubmit() {
    if (this.profileForm.valid) {
      const uid = this.storageService.get('accessToken');
      const { name, lastname } = this.profileForm.value;

      const user: User = {
        ...this.currentUser,
        name,
        lastname,
      };

      this.userService.updateUser(uid ?? '', user).then(() => {
        this.storageService.set('currentUser', JSON.stringify(user));
        this.loadUser();

        this.isToastOpen = true;
        this.messageUpdate = 'Profile updated successfully';
      }).catch(() => {
        this.isToastOpen = true;
        this.messageUpdate = 'Error updating profile';
      });
    }
  }
}
