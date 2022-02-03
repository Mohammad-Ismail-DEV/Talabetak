import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickupOrderPageRoutingModule } from './pickup-order-routing.module';

import { PickupOrderPage } from './pickup-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickupOrderPageRoutingModule
  ],
  declarations: [PickupOrderPage]
})
export class PickupOrderPageModule {}
