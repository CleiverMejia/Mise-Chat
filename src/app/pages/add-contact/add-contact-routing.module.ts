import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddContactPage } from './add-contact.page';
import { authGuard } from 'src/app/core/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AddContactPage,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddContactPageRoutingModule {}
