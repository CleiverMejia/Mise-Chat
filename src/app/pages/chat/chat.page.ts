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
import { HttpService } from '@services/http/http.service';
import { UserService } from '@services/user/user.service';
import { TokenResponse } from '@interfaces/tokenResponse.interface';
import { User } from '@interfaces/user.interface';
import {
  Data,
  Notification,
  SendNotification,
} from '@interfaces/sendNotification.interface';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { Contact } from '@interfaces/contact.interface';

const { v4: uuidv4 } = require('uuid');

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
  recording: boolean = false;

  public inputButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Confirm',
      role: 'confirm',
    },
  ];

  public nicknameInputs = [
    {
      placeholder: 'Nickname',
      name: 'nickname',
      value: '',
    },
  ];

  public Buttons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Confirm',
      role: 'confirm',
    },
  ];

  constructor(
    private messageService: MessageService,
    private actRoute: ActivatedRoute,
    private storageService: StorageService,
    private supabaseService: SupabaseService,
    private contactService: ContactService,
    private httpService: HttpService,
    private userService: UserService
  ) {
    this.chatId = this.actRoute.snapshot.paramMap.get('chatId') as string;
  }

  ngOnInit() {
    Keyboard.setResizeMode({ mode: 'ionic' as KeyboardResize });
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
            uid: this.storageService.get('userToken'),
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

  public async takePicture() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 90,
    });

    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    if (blob) {
      this.file = new File([blob!], uuidv4());
      this.typeMessage = TypeMessage.IMAGE;
    }
  }

  public async pickVideo() {
    const result = await FilePicker.pickVideos();

    if (result.files.length > 0) {
      const file = result.files[0];

      this.file = new File([file.blob!], file.name);
      this.typeMessage = TypeMessage.VIDEO;
    }
  }

  public async pickFile() {
    const result = await FilePicker.pickFiles({
      readData: true,
      types: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'audio/*',
        'text/plain',
      ],
    });

    if (result.files.length > 0) {
      const file = result.files[0];

      this.file = new File([file.blob!], file.name);
      this.typeMessage = TypeMessage.FILE;
    }
  }

  public async getLocation() {
    const permission = await Geolocation.requestPermissions();

    if (permission) {
      const position = await Geolocation.getCurrentPosition();

      this.content = JSON.stringify({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
      this.typeMessage = TypeMessage.LOCATION;

      this.sendMessage();
    }
  }

  unselectFile() {
    this.file = null;
    this.typeMessage = TypeMessage.TEXT;
  }

  setNicknameResult($event: IonAlertCustomEvent<OverlayEventDetail<any>>) {
    const nickname = $event.detail.data.values.nickname;
    const confirm = $event.detail.role === 'confirm';

    if (nickname && nickname.trim() !== '' && confirm) {
      const userId = this.storageService.get('userToken');

      this.contactService.changeNickname(userId, this.chatId, nickname);

      const { name, ...rest } = JSON.parse(
        this.storageService.get('userReceiver')
      );
      this.storageService.set(
        'userReceiver',
        JSON.stringify({ name: nickname, ...rest })
      );
    }
  }

  public callUser(): void {
    this.httpService.getToken().subscribe({
      next: (resp: TokenResponse) => {
        this.storageService.set('accessToken', resp.data.access_token);

        const userId = this.storageService.get('userToken');
        const usersender: User = JSON.parse(
          this.storageService.get('currentUser')
        );

        this.contactService.getContactById(userId, this.chatId).then((resp) => {
          const userReceiver: Contact = resp.data() as Contact;

          this.sendNotification(
            {
              title: 'LLamada entrante',
              body: `${usersender.name} te esta llamando`,
            },
            {
              userId: userReceiver.uid ?? '',
              type: 'incoming_call',
              name: usersender.name,
              userFrom: userId,
            },
            usersender.token ?? ''
          );
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private async sendNotification(
    notification: Notification,
    data: Data,
    token: string
  ) {
    let sendNotification: SendNotification = {
      token: token,
      notification: notification,
      android: {
        priority: 'high',
        data: {
          meetingId: uuidv4(),
          ...data,
        }
      },
    };

    this.httpService.sendNotification(sendNotification).subscribe({
      next: (resp) => {
        console.log(resp);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  public async startRecording() {
    const permit = await VoiceRecorder.requestAudioRecordingPermission();

    if (permit.value) {
      await VoiceRecorder.startRecording();
      this.recording = true;
    }
  }

  public async stopRecording() {
    const result = await VoiceRecorder.stopRecording();
    this.recording = false;

    if (result.value && result.value.recordDataBase64) {
      const base64Audio = result.value.recordDataBase64;
      const mimeType = result.value.mimeType;

      this.file = this.base64ToFile(base64Audio, mimeType);
      this.typeMessage = TypeMessage.AUDIO;
    }
  }

  public base64ToFile(base64String: string, mimeType: string) {
    const base64 = base64String.split(',')[1] || base64String;

    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteArrays);

    return new File([byteArray], uuidv4(), { type: mimeType });
  }

  private scrollToBottom() {
    this.ioncontent.scrollToBottom(300);
  }

  public clearChat() {
    this.storageService.remove('userReceiver');
  }
}
