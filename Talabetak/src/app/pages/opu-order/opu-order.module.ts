import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpuOrderPageRoutingModule } from './opu-order-routing.module';

import { OpuOrderPage } from './opu-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpuOrderPageRoutingModule
  ],
  declarations: [OpuOrderPage]
})
export class OpuOrderPageModule {}
