import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@interfaces/user.interface';
import { Chat } from '@interfaces/chat.interface';
import { Contact } from '@interfaces/contact.interface';
import { ContactService } from '@services/contact/contact.service';
import { StorageService } from '@services/storage/storage.service';
import { UserService } from '@services/user/user.service';
import { ChatService } from '@services/chat/chat.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
  standalone: false,
})
export class AddContactPage implements OnInit {
  contactForm: FormGroup;

  constructor(
    private form: FormBuilder,
    private router: Router,
    private contactService: ContactService,
    private userService: UserService,
    private storageService: StorageService,
    private chatService: ChatService
  ) {
    this.contactForm = this.form.group({
      nickname: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    const { nickname, phone } = this.contactForm.value;

    const uid: string = this.storageService.get('accessToken');

    const user = await this.userService.getUserByPhone(phone);

    if (user) {
      const chat: Chat = {
        uid1: uid,
        uid2: user.uid ?? '',
      };

      this.chatService.createChat(chat).then((newChat) => {
        const contact1: Contact = {
          nickname: nickname,
          uid: user.uid ?? '',
        };

        const contact2: Contact = {
          nickname: 'Unknown',
          uid: uid,
        };

        Promise.all([
          this.contactService.addContact(uid, newChat.id, contact1),
          this.contactService.addContact(user.uid ?? '', newChat.id, contact2),
        ]).then((resp) => {
          this.contactForm.reset();
          this.router.navigate(['/home']);
        });
      });
    }
  }
}
