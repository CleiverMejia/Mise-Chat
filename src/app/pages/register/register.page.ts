import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { User } from '@interfaces/user.interface';
import { AuthService } from '@services/auth/auth.service';
import { SupabaseService } from '@services/supabase/supabase.service';
import { UserService } from '@services/user/user.service';

const { v4: uuidv4 } = require('uuid');

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  public registerForm: FormGroup;
  public url: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  private imageFile: File | null = null;

  constructor(
    private form: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.registerForm = this.form.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {}

  public async onSubmit() {
    if (this.registerForm.valid) {
      const { name, lastname, email, password, phone } =
        this.registerForm.value;

      const imageUrl = await this.supabaseService.uploadFile(this.imageFile!);

      this.authService
        .register(email, password)
        .then((userCredential) => {
          if (userCredential.user) {
            const user: User = {
              imageUrl,
              name,
              lastname,
              phone,
            };

            this.userService.createUser(userCredential.user.uid, user);
            this.router.navigate(['/login']);
          }
        })
        .catch((error) => {
          console.error('Error registering user:', error);
        });
    }
  }

  public async takePicture() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 90,
    });

    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    if (blob) {
      this.imageFile = new File([blob!], uuidv4());
      this.url = URL.createObjectURL(this.imageFile)
    }
  }
}
