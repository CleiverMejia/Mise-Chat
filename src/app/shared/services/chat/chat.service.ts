import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { Chat } from '@interfaces/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly CHATS: string = 'chats';

  constructor(private firestore: Firestore) { }

  public async getChatById(id: string){
    return await getDoc(doc(this.firestore, this.CHATS, id));
  }

  public async createChat(chat: Chat) {
    const placeRef = collection(this.firestore, this.CHATS);

    return await addDoc(placeRef, chat);
  }
}
