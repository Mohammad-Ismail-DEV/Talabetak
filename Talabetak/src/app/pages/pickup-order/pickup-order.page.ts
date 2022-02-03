import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ToastController } from '@ionic/angular';
import { Location } from 'src/app/services/location';
import { Connections } from '../../services/connections';
@Component({
  selector: 'app-pickup-order',
  templateUrl: './pickup-order.page.html',
  styleUrls: ['./pickup-order.page.scss'],
})
export class PickupOrderPage implements OnInit {
  ngOnInit() {
    if (localStorage.getItem("token") === null) {
      this.conn.signOut();
    }
  }

  signOut() {
    this.conn.signOut();
  }

  constructor(
    private imagePicker: ImagePicker,
    private conn: Connections,
    private router: Router,
    private toastController: ToastController
  ) {}

	public showLoader = false
  public orderType = this.conn.orderType + ' Order';
  public trackId = this.conn.orderTrackId;
  public orderId = this.conn.orderOrderId;
  public receiver = JSON.parse(localStorage.getItem("order")).receiver.teamMember.fullName;
  public receiverPhoneNumber = JSON.parse(localStorage.getItem("order")).receiver.teamMember.telephone;
  public sender = JSON.parse(localStorage.getItem("order")).sender.teamMember.fullName;
  public paySenLBP = JSON.parse(localStorage.getItem("order")).order.toBePaidToSender;
  public paySenUSD = JSON.parse(localStorage.getItem("order")).order.toBePaidToSenderUSD;
  
  public username = localStorage.getItem("userName");
  public title = localStorage.getItem("title");
  public data: any;
  public coordinates: any = this.conn.latitude + ',' + this.conn.longitude;
  public options: any = {
    quality: 100,
    maximumImagesCount: 3,
    DATA_URI: 1,
    outputType: 1,
  };
  public label = encodeURI('location');
  public coverImage = localStorage.getItem("coverImage");;

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
      if (this.paySenLBP > 0 && this.paySenUSD > 0) {
        this.conn.signatureData =
					this.sender
					//+
          //'received' +
          //this.paySenLBP +
          //'LL and ' +
          //this.paySenUSD +
          //'$';
      } else if (this.paySenLBP > 0) {
				this.conn.signatureData = this.sender
					//+ 'received' + this.paySenLBP;
      } else if (this.paySenUSD > 0) {
				this.conn.signatureData = this.sender
					//+ 'received' + this.paySenUSD;
      }
			localStorage.setItem("signatureData", this.conn.signatureData)
      this.router.navigateByUrl('/signature');
    }
  }
}
