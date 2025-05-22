import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { TypeMessage } from '@enums/typeMessage.enum';
import { Message } from '@interfaces/message.interface';
import { MessageService } from '@services/message/message.service';
import { StorageService } from '@services/storage/storage.service';
import { SupabaseService } from '@services/supabase/supabase.service';

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
    private messageService: MessageService,
    private actRoute: ActivatedRoute,
    private storageService: StorageService,
    private supabaseService: SupabaseService,
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
    if (this.content) {
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
  }

  selectedFile($event: Event) {
    const file = ($event.target as HTMLInputElement).files?.[0];

    if (file) {
      console.log(file);
    }
  }

  uploadFile($event: Event) {
    
  }

  private scrollToBottom() {
    this.ioncontent.scrollToBottom(300);
  }

  public clearChat() {
    this.storageService.remove('userReceiver');
  }
}
