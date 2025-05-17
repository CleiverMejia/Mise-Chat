import { Component, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { last } from 'rxjs';
import User from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  public registerForm: FormGroup;

  constructor(
    private form: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.form.group({
      imageUrl: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.registerForm.valid) {
      const { imageUrl, name, lastname, email, password, phone } =
        this.registerForm.value;

      this.authService
        .register(email, password)
        .then((userCredential) => {
          if (userCredential.user) {
            const user: User = {
              imageUrl,
              name,
              lastname,
              phone,
            }

            this.userService.createUser(userCredential.user.uid, user);
            this.router.navigate(['/login']);
          }
        })
        .catch((error) => {
          console.error('Error registering user:', error);
        });
    }
  }
}
