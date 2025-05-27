import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { TypeMessage } from '@enums/typeMessage.enum';
import { Message } from '@interfaces/message.interface';
import { MessageService } from '@services/message/message.service';
import { StorageService } from '@services/storage/storage.service';
import { SupabaseService } from '@services/supabase/supabase.service';
import { IonAlertCustomEvent, OverlayEventDetail } from '@ionic/core';
import { ContactService } from '@services/contact/contact.service';

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
  typeMessageEnum = TypeMessage;
  file: File | null = null;

  public inputButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'Confirm',
      role: 'confirm'
    },
  ];

  public nicknameInputs = [
    {
      placeholder: 'Nickname',
      name: 'nickname',
      value: ''
    },
  ];

  constructor(
    private messageService: MessageService,
    private actRoute: ActivatedRoute,
    private storageService: StorageService,
    private supabaseService: SupabaseService,
    private contactService: ContactService,
  ) {
    this.chatId = this.actRoute.snapshot.paramMap.get('chatId') as string;
  }

  ngOnInit() {
    this.setMessages();
  }

  private setMessages() {
    this.messageService.getMessages(this.chatId).subscribe((messages) => {
      this.messages = messages;
      this.scrollToBottom();
    });
  }

  public sendMessage() {
    if (this.content || this.file) {
      this.supabaseService
        .uploadFile(this.file!)
        .then((respUrl: string) => {
          this.content = respUrl;
        })
        .finally(() => {
          let Message: Message = {
            uid: this.storageService.get('accessToken'),
            content: this.content,
            type: this.typeMessage,
            date: Timestamp.now(),
          };

          this.content = '';
          this.file = null;
          this.typeMessage = TypeMessage.TEXT;

          this.messageService.sendMessage(this.chatId, Message).then(() => {
            this.scrollToBottom();
          });
        });
    }
  }

  selectedFile($event: Event, type: TypeMessage) {
    this.file = ($event.target as HTMLInputElement).files?.[0] ?? null;
    this.typeMessage = type;

    if (this.file) {
      console.log(this.file);
    }
  }

  unselectFile() {
    this.file = null;
    this.typeMessage = TypeMessage.TEXT;
  }

  setNicknameResult($event: IonAlertCustomEvent<OverlayEventDetail<any>>) {
    const nickname = $event.detail.data.values.nickname;
    const confirm = $event.detail.role === 'confirm';

    if(nickname && nickname.trim() !== '' && confirm) {
      const userId = this.storageService.get('accessToken');

      this.contactService.changeNickname(userId, this.chatId, nickname);

      const { name, ...rest} = JSON.parse(this.storageService.get('userReceiver'));
      this.storageService.set('userReceiver', JSON.stringify({ name: nickname, ...rest }));
    }
  }

  private scrollToBottom() {
    this.ioncontent.scrollToBottom(300);
  }

  public clearChat() {
    this.storageService.remove('userReceiver');
  }
}
