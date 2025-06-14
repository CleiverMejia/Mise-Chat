import { Component, OnInit } from '@angular/core';
import { Contact } from '@interfaces/contact.interface';
import { User } from '@interfaces/user.interface';
import { ContactService } from '@services/contact/contact.service';
import { StorageService } from '@services/storage/storage.service';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';
import { FcmService } from '@services/fcm/fcm.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  currentUser!: User;
  contacts: Contact[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private storageService: StorageService,
    private contactService: ContactService,
    private fcmService: FcmService,
  ) {}

  ionViewWillEnter() {
    this.fcmService.initPush();
  }

  ngOnInit() {
    this.getCurrentUser();
    this.setContacts();
  }

  private setContacts(): void {
    const userId = this.storageService.get('userToken');

    this.contactService.getContacts(userId).subscribe((contacts) => {
      this.contacts = contacts;
    });
  }

  getCurrentUser() {
    const userId = this.storageService.get('userToken');

    this.userService.getUser(userId).then((user) => {
      this.currentUser = user.data() as User

      this.storageService.set('currentUser', JSON.stringify(this.currentUser));
    });
  }

  public logout(): void {
    this.storageService.clear();
    this.authService.logout();
  }
}
