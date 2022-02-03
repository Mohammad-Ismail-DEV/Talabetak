import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'transfer',
    loadChildren: () =>
      import('./pages/transfer/transfer.module').then(
        (m) => m.TransferPageModule
      ),
  },
  {
    path: 'signature',
    loadChildren: () =>
      import('./pages/signature/signature.module').then(
        (m) => m.SignaturePageModule
      ),
  },
  {
    path: 'transfers',
    loadChildren: () =>
      import('./pages/transfers/transfers.module').then(
        (m) => m.TransfersPageModule
      ),
  },
  {
    path: 'pickup-order',
    loadChildren: () =>
      import('./pages/pickup-order/pickup-order.module').then(
        (m) => m.PickupOrderPageModule
      ),
  },
  {
    path: 'delivery-order',
    loadChildren: () =>
      import('./pages/delivery-order/delivery-order.module').then(
        (m) => m.DeliveryOrderPageModule
      ),
  },
  {
    path: 'return-order',
    loadChildren: () =>
      import('./pages/return-order/return-order.module').then(
        (m) => m.ReturnOrderPageModule
      ),
  },
  {
    path: 'transport-order',
    loadChildren: () =>
      import('./pages/transport-order/transport-order.module').then(
        (m) => m.TransportOrderPageModule
      ),
  },  {
    path: 'opu-order',
    loadChildren: () => import('./pages/opu-order/opu-order.module').then( m => m.OpuOrderPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
