import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '@interfaces/message.interface';

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

  public getCountMessages(cid: string): Observable<number> {
    const messagesRef = collection(
      this.firestore,
      this.CHATS,
      cid,
      this.MESSAGES
    );

   return collectionData(messagesRef).pipe(
    map((messages) => messages.length)
   );
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
