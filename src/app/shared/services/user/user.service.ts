import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { User } from '@interfaces/user.interface';
import { doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USERS: string = 'users';

  constructor(private firestore: Firestore) {}

  public getUsers(): Observable<User[]> {
    const placeRef = collection(this.firestore, this.USERS);

    return collectionData(placeRef, {
      idField: 'uid',
    }) as Observable<User[]>;
  }

  public async getUser(id: string) {
    return await getDoc(doc(this.firestore, this.USERS, id))
  }

  public async createUser(id: string, user: User): Promise<void> {
    const placeRef = doc(this.firestore, this.USERS, id);

    await setDoc(placeRef, user);
  }

  public async getUserByPhone(phone: string): Promise<User> {
    const q = query(
      collection(this.firestore, this.USERS),
      where('phone', '==', phone)
    );

    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs[0]

    return { ...docs.data(), uid: docs.id } as unknown as User;
  }

  public async setUserToken(id: string, token: string) {
    const placeRef = doc(this.firestore, this.USERS, id ?? '');

    return updateDoc(placeRef, {token: token});
  }

  public async updateUser(id: string, user: User) {
    const placeRef = doc(this.firestore, this.USERS, id ?? '');

    return updateDoc(placeRef, { ...user });
  }

  public async userExistByPhone(phone: string): Promise<boolean> {
    const q = query(
      collection(this.firestore, this.USERS),
      where('phone', '==', phone)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      if(userData) return true
    }

    return false;
  }
}