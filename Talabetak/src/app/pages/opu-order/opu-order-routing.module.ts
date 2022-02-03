import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpuOrderPage } from './opu-order.page';

const routes: Routes = [
  {
    path: '',
    component: OpuOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpuOrderPageRoutingModule {}
