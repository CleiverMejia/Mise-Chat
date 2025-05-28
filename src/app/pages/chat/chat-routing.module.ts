import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatPage } from './chat.page';
import { authGuard } from 'src/app/core/guards/auth/auth.guard';
import { chatGuard } from 'src/app/core/guards/chat/chat.guard';

const routes: Routes = [
  {
    path: '',
    component: ChatPage,
    canActivate: [chatGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule {}
