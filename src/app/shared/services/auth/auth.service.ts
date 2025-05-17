import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
  onAuthStateChanged,
  User as FirebaseUser,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  public login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  public getCurrentUser(): Promise<FirebaseUser | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, resolve);
    });
  }

  public logout(): Promise<void> {
    return signOut(this.auth);
  }
}