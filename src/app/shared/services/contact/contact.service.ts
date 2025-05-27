import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { Contact } from '@interfaces/contact.interface';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly USERS: string = 'users';
  private readonly CONTACTS: string = 'contacts';

  constructor(private firestore: Firestore) {}

  getContacts(userId: string): Observable<Contact[]> {
    const placeRef = collection(
      this.firestore,
      this.USERS,
      userId,
      this.CONTACTS
    );

    return collectionData(placeRef, {
      idField: 'cid',
    }) as Observable<Contact[]>;
  }

  public async getContactById(userId: string, chatId: string) {
    return await getDoc(doc(this.firestore, this.USERS, userId, this.CONTACTS, chatId))
  }

  async addContact(userId: string, chatId: string, contact: Contact) {
    const placeRef = doc(this.firestore, this.USERS, userId, this.CONTACTS, chatId);

    await setDoc(placeRef, contact);
  }

  public async changeNickname(id: string, chatId: string, nickname: string) {
    const placeRef = doc(this.firestore, this.USERS, id, this.CONTACTS, chatId);

    return updateDoc(placeRef, { nickname: nickname });
  }
}