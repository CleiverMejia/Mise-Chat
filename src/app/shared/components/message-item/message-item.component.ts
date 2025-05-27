import { Component, Input, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { StorageService } from '@services/storage/storage.service';
import { User } from '@interfaces/user.interface';
import { TypeMessage } from '@enums/typeMessage.enum';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
  standalone: false,
})
export class MessageItemComponent implements OnInit {
  @Input() cid: string = '';
  @Input() url: string = '';
  @Input() uid: string = '';
  @Input() message: string = '';
  @Input() type: TypeMessage = TypeMessage.TEXT;
  @Input() date: Timestamp = Timestamp.now();

  typeMessage = TypeMessage;
  isCurrentUser!: boolean;
  sender!: User;
  receiver!: User;

  constructor(
    private storageService: StorageService,
  ) {
  }

  ngOnInit() {
    this.setCurrentUser();
    this.setSender();
    this.setReceiver();
  }

  public setCurrentUser(): void {
    const accessToken = this.storageService.get('accessToken');

    this.isCurrentUser = this.uid === accessToken;
  }

  private setSender(): void {
    const userSender = this.storageService.get('currentUser');

    if (userSender) this.sender = JSON.parse(userSender)
  }

  private setReceiver(): void {
    const userReceiver = this.storageService.get('userReceiver');

    if (userReceiver) this.receiver = JSON.parse(userReceiver)
  }

  getFileName() {
    const fileSplit = this.message.split('/');
    const file = fileSplit[fileSplit.length - 1].split('_');
    file.shift();

    const fileName = file?.join('');

    return fileName ? fileName : 'Unknown File';
  }
}
