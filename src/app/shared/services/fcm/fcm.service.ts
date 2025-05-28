import { Injectable, NgZone } from '@angular/core';

import { Router } from '@angular/router';

import { Capacitor } from '@capacitor/core';

import { PushNotifications } from '@capacitor/push-notifications';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) { }

  initPush() {
    console.log('platform wroking');

    if (Capacitor.isNativePlatform()) {
      this.registerPush();
    }
  }

  private registerPush() {
    PushNotifications.requestPermissions().then(async (permission) => {
      if (permission.receive == 'granted') {
        await PushNotifications.register();
      } else {
        // No permission to push granted
      }
    });

    PushNotifications.addListener('registration', async (token) => {
      if (token) {
        this.authService.getCurrentUser().then(resp => {
          if (resp) {
            this.userService.setUserToken(resp.uid, token.value)
          }
        })
      }
    });
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error', JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification) => {
        console.log('notification', notification);

        const data = notification.notification;

        console.log('data token data', data.data);

        this.router.navigateByUrl('/call');
      }
    );
  }
}