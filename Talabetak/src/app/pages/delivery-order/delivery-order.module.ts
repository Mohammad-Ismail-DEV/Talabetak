import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveryOrderPageRoutingModule } from './delivery-order-routing.module';

import { DeliveryOrderPage } from './delivery-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryOrderPageRoutingModule
  ],
  declarations: [DeliveryOrderPage]
})
export class DeliveryOrderPageModule {}
