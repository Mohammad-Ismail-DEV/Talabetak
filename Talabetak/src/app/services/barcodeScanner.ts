import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from '@ionic-native/barcode-scanner/ngx';
import { Connections } from './connections';

@Injectable({
  providedIn: 'root',
})
export class CodeScanner {
  constructor(
    private barcodeScanner: BarcodeScanner,
    public toastController: ToastController,
    private conn: Connections
  ) {
    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true,
    };
    this.locationCoords = {
      latitude: '',
      longitude: '',
      accuracy: '',
      timestamp: '',
    };
    this.timetest = Date.now();
  }
  transfer = ['PIC', 'DEL', 'RET', 'TRA'];
  encodeData: any;
  scannedData: {};
  locationCoords: any;
  timetest: any;
  barcodeScannerOptions: BarcodeScannerOptions;
  scanCode() {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        this.scannedData = barcodeData;
        if (barcodeData.text != null && barcodeData.text != '') {
          if (this.transfer.includes(barcodeData.text.substring(0, 3))) {
            this.conn.findTransferByTrackId(barcodeData.text);
          } else {
            this.conn.findOrderByTrackId(barcodeData.text);
          }
        }
      })
      .catch(async (err) => {
        const toast = await this.toastController.create({
          message: err,
          duration: 3000,
          color: 'danger',
        });
        toast.present();
      });
  }
}
