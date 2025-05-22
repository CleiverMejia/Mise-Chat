import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { StorageService } from '@services/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private router: Router,
    private form: FormBuilder,
    private authService: AuthService,
    private storageSevice: StorageService
  ) {
    this.loginForm = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      try {
        const userCredential = await this.authService.login(email, password);

        if (userCredential.user) {
          this.storageSevice.set('accessToken', userCredential.user.uid);
          this.router.navigate(['/home']);
        }
      } catch (error) {
        console.error('Error logging in:', error);
      }
    }
  }
}
