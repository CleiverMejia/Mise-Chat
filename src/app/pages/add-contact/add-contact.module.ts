import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddContactPageRoutingModule } from './add-contact-routing.module';

import { AddContactPage } from './add-contact.page';
import { CoreModule } from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddContactPageRoutingModule,
    CoreModule,
    ReactiveFormsModule
],
  declarations: [AddContactPage]
})
export class AddContactPageModule {}
