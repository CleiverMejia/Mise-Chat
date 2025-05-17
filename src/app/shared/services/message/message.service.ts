import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  getDocs,
  orderBy,
  query,
  setDoc,
} from '@angular/fire/firestore';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import Message from '../../interfaces/message.interface';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly CHATS: string = 'chats';
  private readonly MESSAGES: string = 'messages';

  constructor(private firestore: Firestore) {}

  public getMessages(cid: string): Observable<Message[]> {
    const messagesRef = collection(
      this.firestore,
      this.CHATS,
      cid,
      this.MESSAGES
    );

    const q = query(messagesRef, orderBy('date', 'asc'));

   return collectionData(q) as Observable<Message[]>
  }

  public async sendMessage(cid: string, message: Message): Promise<void> {
    const messagesRef = collection(
      this.firestore,
      this.CHATS,
      cid,
      this.MESSAGES
    );

    await addDoc(messagesRef, message);
  }
}
