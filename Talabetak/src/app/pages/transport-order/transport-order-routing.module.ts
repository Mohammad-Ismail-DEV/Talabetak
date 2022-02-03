import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransportOrderPage } from './transport-order.page';

const routes: Routes = [
  {
    path: '',
    component: TransportOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransportOrderPageRoutingModule {}
