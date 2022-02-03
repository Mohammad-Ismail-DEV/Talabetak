import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReturnOrderPageRoutingModule } from './return-order-routing.module';

import { ReturnOrderPage } from './return-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnOrderPageRoutingModule
  ],
  declarations: [ReturnOrderPage]
})
export class ReturnOrderPageModule {}
