import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@interfaces/user.interface';
import { StorageService } from '@services/storage/storage.service';
import { SupabaseService } from '@services/supabase/supabase.service';
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
  url!: string;
  imageFile: File | null = null;

  constructor(
    private storageService: StorageService,
    private form: FormBuilder,
    private userService: UserService,
    private supabaseService: SupabaseService,
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  private loadUser() {
    this.currentUser = JSON.parse(this.storageService.get('currentUser'));
    this.url = this.currentUser?.imageUrl ?? 'https://ionicframework.com/docs/img/demos/avatar.svg';

    this.profileForm = this.form.group({
      name: [this.currentUser?.name, Validators.required],
      lastname: [this.currentUser?.lastname, Validators.required],
    });
  }

  public async onSubmit() {
    if (this.profileForm.valid) {
      const uid = this.storageService.get('accessToken');
      const { name, lastname } = this.profileForm.value;

      if (this.imageFile) {
        try {
          this.url = await this.supabaseService.uploadFile(this.imageFile);
        } catch (error) {
          this.url = this.supabaseService.getPublicUrl(this.imageFile.name);

          console.log(this.url);
        };
      }

      const user: User = {
        ...this.currentUser,
        imageUrl: this.url,
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

  onImageSelected($event: Event) {
    const file = ($event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.url = URL.createObjectURL(file);
      this.imageFile = file;
    }
  }
}
