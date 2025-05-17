import { Component, Input, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { StorageService } from '../../services/storage/storage.service';
import Contact from '../../interfaces/contact.interface';
import User from '../../interfaces/user.interface';
import { ContactService } from '../../services/contact/contact.service';
import { UserService } from '../../services/user/user.service';

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
  @Input() type: string = '';
  @Input() date: Timestamp = Timestamp.now();

  isCurrentUser!: boolean;
  sender!: User;
  receiver!: User;

  constructor(
    private storageService: StorageService,
  ) {}

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

    this.sender = JSON.parse(userSender)
  }

  private setReceiver(): void {
    const userReceiver = this.storageService.get('userReceiver');

    this.receiver = JSON.parse(userReceiver)
  }
}
