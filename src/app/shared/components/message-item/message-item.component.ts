import { Component, Input, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { StorageService } from '@services/storage/storage.service';
import { User } from '@interfaces/user.interface';
import { TypeMessage } from '@enums/typeMessage.enum';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '@environments/environment';

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

  private readonly MAPBOX_TOKEN = environment.mapboxToken;

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

  map!: mapboxgl.Map;

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
    const userToken = this.storageService.get('userToken');

    this.isCurrentUser = this.uid === userToken;
  }

  private setSender(): void {
    const userSender = this.storageService.get('currentUser');

    if (userSender) this.sender = JSON.parse(userSender)
  }

  private setReceiver(): void {
    const userReceiver = this.storageService.get('userReceiver');

    if (userReceiver) this.receiver = JSON.parse(userReceiver)
  }

  public getFileName() {
    const fileSplit = this.message.split('/');
    const file = fileSplit[fileSplit.length - 1].split('_');
    file.shift();

    const fileName = file?.join('');

    return fileName ? fileName : 'Unknown File';
  }

  public setLocation() {
    const { latitude, longitude } = JSON.parse(this.message);

    (mapboxgl as any).accessToken = this.MAPBOX_TOKEN;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: 13,
    });

    const marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([longitude, latitude])
      .addTo(this.map);
  }
}
