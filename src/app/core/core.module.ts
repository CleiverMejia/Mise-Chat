import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = environment.firebaseConfig;

@NgModule({
  declarations: [HeaderComponent],
  imports: [IonicModule],
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  exports: [HeaderComponent],
})
export class CoreModule {}
