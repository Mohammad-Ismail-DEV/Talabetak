import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransportOrderPageRoutingModule } from './transport-order-routing.module';

import { TransportOrderPage } from './transport-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransportOrderPageRoutingModule
  ],
  declarations: [TransportOrderPage]
})
export class TransportOrderPageModule {}
