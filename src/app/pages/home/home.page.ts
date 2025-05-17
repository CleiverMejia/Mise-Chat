import { Component, OnInit } from '@angular/core';
import Contact from 'src/app/shared/interfaces/contact.interface';
import User from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ContactService } from 'src/app/shared/services/contact/contact.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { UserService } from 'src/app/shared/services/user/user.service';

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
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.getCurrentUser();
    this.setContacts();
  }

  private setContacts(): void {
    const userId = this.storageService.get('accessToken');

    this.contactService.getContacts(userId).subscribe((contacts) => {
      this.contacts = contacts;
    });
  }

  getCurrentUser() {
    const userId = this.storageService.get('accessToken');

    this.userService.getUser(userId).then((user) => {
      this.currentUser = user.data() as User

      this.storageService.set('currentUser', JSON.stringify(this.currentUser));
    });
  }

  public logout(): void {
    this.authService.logout();
  }
}
