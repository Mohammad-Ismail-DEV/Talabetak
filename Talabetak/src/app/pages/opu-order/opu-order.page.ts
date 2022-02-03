import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ToastController } from '@ionic/angular';
import { Connections } from '../../services/connections';
@Component({
  selector: 'app-opu-order',
  templateUrl: './opu-order.page.html',
  styleUrls: ['./opu-order.page.scss'],
})
export class OpuOrderPage implements OnInit {
	ngOnInit() {
    if (localStorage.getItem("token") === null) {
      this.conn.signOut();
    }
  }

  signOut() {
    this.conn.signOut();
  }

  constructor(
    private conn: Connections,
    private router: Router,
    private imagePicker: ImagePicker,
    private toastController: ToastController
  ) {}

  public orderType = 'Pickup OPU Order';
  public trackId = this.conn.trackId;
  public orderId = this.conn.orderOrderId;
  public sender = JSON.parse(localStorage.getItem("order")).sender.teamMember.fullName;
  
  public username = localStorage.getItem("userName");
  public title = localStorage.getItem("title");
  public toBePickedUp = JSON.parse(localStorage.getItem("order")).order.expectedTBPickedup;
  public toBePaidUSD = JSON.parse(localStorage.getItem("order")).order.toBePaidToSenderUSD;
  public toBePaidLBP = JSON.parse(localStorage.getItem("order")).order.toBePaidToSender;
  public coverImage = localStorage.getItem("coverImage");
  public senderPhoneNumber = JSON.parse(localStorage.getItem("order")).sender.teamMember.telephone;
	public showLoader: boolean = false;
  public data: any;
  public coordinates: any = this.conn.latitude + ',' + this.conn.longitude;
  public options: any = {
    quality: 100,
    maximumImagesCount: 3,
    DATA_URI: 1,
    outputType: 1,
  };
  public label = encodeURI('location');

  async openMaps() {
    if (this.coordinates !== ',') {
      window.open(
        'geo:0,0?q=' + this.coordinates + '(' + this.label + ')',
        '_system'
      );
    } else {
      const toast = await this.toastController.create({
        message: 'No Registered Location Found',
        duration: 3000,
        color: 'danger',
      });
      toast.present();
    }
  }

  upload() {
    this.imagePicker.getPictures(this.options).then(
      (results) => {
        this.conn.addScreenShotToOrder(results);
      },
      (err) => {}
    );
  }

  navigate(text) {
    if (text === 'home') {
      this.router.navigateByUrl('/home');
      this.conn.getUserData(true);
    }
		if (text === 'signature') {
      if (this.toBePaidUSD > 0 && this.toBePaidLBP > 0) {
        this.conn.signatureData =
          this.sender +
          ' Received ' +
          this.toBePaidUSD +
          '$' +
          ' and ' +
          this.toBePaidLBP +
          'LL';
      } else if (this.toBePaidUSD > 0 && this.toBePaidLBP === 0) {
        this.conn.signatureData = this.sender + ' Received ' + this.toBePaidUSD;
      } else if (this.toBePaidLBP > 0 && this.toBePaidUSD === 0) {
        this.conn.signatureData = this.sender + ' Received ' + this.toBePaidLBP;
			} else if (this.toBePaidUSD === 0 && this.toBePaidLBP === 0) {
        this.conn.signatureData =
          this.sender +
          ' Received Nothing'
			}
			localStorage.setItem("signatureData", this.conn.signatureData)
      this.router.navigateByUrl('/signature');
    }
  }
}
