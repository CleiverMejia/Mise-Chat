import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ChatItemComponent } from './components/chat-item/chat-item.component';
import { RouterModule } from '@angular/router';
import { MessageItemComponent } from './components/message-item/message-item.component';
import { ReactiveFormsModule } from '@angular/forms';

const COMPONENTS = [MessageItemComponent, ChatItemComponent];

const IMPORTS = [CommonModule, IonicModule, RouterModule, ReactiveFormsModule];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...IMPORTS],
  exports: [...COMPONENTS],
})
export class SharedModule {}
