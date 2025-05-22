import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from '@services/storage/storage.service';
import { MessageService } from '@services/message/message.service';
import { ContactService } from '@services/contact/contact.service';
import { UserService } from '@services/user/user.service';
import { Contact } from '@interfaces/contact.interface';
import { User } from '@interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
  standalone: false,
})
export class ChatItemComponent implements OnInit {
  @Input() cid!: string;
  @Input() url!: string;
  @Input() nickname!: string;
  messageCount: number = 0;

  constructor(
    private messageService: MessageService,
    private storageService: StorageService,
    private contactService: ContactService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.setMessageCount();
    this.getProfileImage();
  }

  setMessageCount() {
    this.messageService
      .getCountMessages(this.cid)
      .subscribe((count) => (this.messageCount = count));
  }

  public goToChat() {
    const userId: string = this.storageService.get('accessToken');

    this.contactService.getContactById(userId, this.cid).then((resp) => {
      const contact: Contact = resp.data() as Contact;

      this.userService.getUser(contact?.uid ?? '').then((resp: any) => {
        const user: User = resp.data() as User;
        user.name = contact.nickname;

        this.storageService.set('userReceiver', JSON.stringify(user));
        this.router.navigate(['/chat', this.cid ]);
      });
    });
  }

  getProfileImage() {
    const userId: string = this.storageService.get('accessToken');

    this.contactService.getContactById(userId, this.cid).then((resp) => {
      const contact: Contact = resp.data() as Contact;

      this.userService.getUser(contact?.uid ?? '').then((resp: any) => {
        const user: User = resp.data() as User;

        this.url = user.imageUrl;
      });
    });
  }
}
