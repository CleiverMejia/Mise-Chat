import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { TypeMessage } from 'src/app/shared/enums/typeMessage.enum';
import Contact from 'src/app/shared/interfaces/contact.interface';
import Message from 'src/app/shared/interfaces/message.interface';
import User from 'src/app/shared/interfaces/user.interface';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { ContactService } from 'src/app/shared/services/contact/contact.service';
import { MessageService } from 'src/app/shared/services/message/message.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false,
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) ioncontent!: IonContent;

  messages: Message[] = [];
  chatId: string;
  content: string = '';
  typeMessage: TypeMessage = TypeMessage.TEXT;

  constructor(
    private chatService: ChatService,
    private contactService: ContactService,
    private userService: UserService,
    private messageService: MessageService,
    private actRoute: ActivatedRoute,
    private storageService: StorageService
  ) {
    this.chatId = this.actRoute.snapshot.paramMap.get('chatId') as string;
  }

  ngOnInit() {
    this.getReceiver();
    this.setMessages();
  }

  private setMessages() {
    this.messageService.getMessages(this.chatId).subscribe((messages) => {
      this.messages = messages;
    });
  }

  public getReceiver() {
    const userId: string = this.storageService.get('accessToken');

    this.contactService.getContactById(userId, this.chatId).then((resp) => {
      const contact: Contact = resp.data() as Contact;

      this.userService.getUser(contact?.uid ?? '').then((resp) => {
        const user: User = resp.data() as User;
        user.name = contact.nickname;

        this.storageService.set('userReceiver', JSON.stringify(user));
      });
    });
  }

  public sendMessage() {
    let Message: Message = {
      uid: this.storageService.get('accessToken'),
      content: this.content,
      type: this.typeMessage,
      date: Timestamp.now(),
    };

    this.content = '';

    this.messageService.sendMessage(this.chatId, Message).then(() => {
      this.scrollToBottom();
    });
  }

  private scrollToBottom() {
    this.ioncontent.scrollToBottom(300);
  }
}
