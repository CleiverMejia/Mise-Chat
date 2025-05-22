import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallPage } from './call.page';
import { authGuard } from 'src/app/core/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CallPage,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallPageRoutingModule {}
