import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Connections } from '../../services/connections';
import { Location } from '../../services/location';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

var baseUrl =
  'https://talabetak-preproduction.talabetakmobile.com/pm4pi-portal';

@Component({
  selector: 'app-delivery-order',
  templateUrl: './delivery-order.page.html',
  styleUrls: ['./delivery-order.page.scss'],
})
export class DeliveryOrderPage implements OnInit {
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
		private http: HttpClient,
    private toastController: ToastController
  ) {}

	public showLoader: boolean = false;
	public showChooser: boolean = false;
  public orderType = this.conn.orderType + ' Order';
  public trackId = this.conn.orderTrackId;
	public orderId = this.conn.orderOrderId;
	public myCurrentOrder = JSON.parse(localStorage.getItem("order")).order;
  public receiver = JSON.parse(localStorage.getItem("order")).receiver.teamMember.fullName;
  public receiverPhoneNumber = JSON.parse(localStorage.getItem("order")).receiver.teamMember.telephone;
  public payRecLBP = JSON.parse(localStorage.getItem("order")).order.toBePaidToReceiver;
  public payRecUSD = JSON.parse(localStorage.getItem("order")).order.toBePaidToReceiverUSD;
  public collectRecLBP = JSON.parse(localStorage.getItem("order")).order.toBeCollectedFromReceiver;
  public collectRecUSD = JSON.parse(localStorage.getItem("order")).order.toBeCollectedFromReceiverUSD;
  public sender = JSON.parse(localStorage.getItem("order")).sender.teamMember.fullName;
  public username = localStorage.getItem("userName");
  public title = localStorage.getItem("title");
	public coverImage = localStorage.getItem("coverImage");	
  public data: any;
  public coordinates: any = this.conn.latitude + ',' + this.conn.longitude;
  public options: any = {
    quality: 100,
    maximumImagesCount: 3,
    DATA_URI: 1,
    outputType: 1,
  };
	public label = encodeURI('location');
	public payll: any;
	public payusd: any;

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
	
	closeChooser() {
		this.showChooser = false;

	}

	chooser() {

		var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .get<any>(baseUrl + '/ordermngmt/ordermobile/getCompanyUSDMainRate/', {
        headers,
      })
			.subscribe(async (data) => {
				this.showChooser = false;

				let currentRATE: any                         = +(data);
				this.conn.currentCompanyRate                 = currentRATE;

		this.payll = "0";
		this.payusd = "1";

		let packagePriceLBPCurrencyDollar: any;
		let dcFinal: any;

		let andCapital: any = " AND ";
		let andMin: any = " and ";
		let orCapital: any = " OR ";
		let orMin: any = " or ";

		let lastShowing: any = "";

		let isAndOrder: boolean 							       = this.myCurrentOrder.packagePricesAND;
		let deliveryCostPaidBySender: boolean 	     = this.myCurrentOrder.deliveryCostPaidBySender;
		let deliveryCostPaidBySenderPartial: boolean = this.myCurrentOrder.deliveryCostPaidBySenderPartial;
		
		let packagePriceInLBP: any 								   = this.myCurrentOrder.packagePriceInLBP;
		let packagePriceInDollar: any 				   		 = this.myCurrentOrder.packagePriceInDollar;
		let toBeCollectedFromReceiver: any			     = this.myCurrentOrder.toBeCollectedFromReceiver;
		let orderRate: any											     = this.myCurrentOrder.rateOnOrder;
		let partiaLLSender: any                      = this.myCurrentOrder.deliveryCostPBSPartialPriceLL;
		let deliveryCost: any                        = this.myCurrentOrder.deliveryCost;
		let multipleDelivery: any 							     = this.myCurrentOrder.multipleDelivery;
		
		let totalDelivery: any 								       = deliveryCost * multipleDelivery;
		let diffDeliveryPartial: any 						     = totalDelivery - partiaLLSender;
		
		if (deliveryCostPaidBySender) {
			dcFinal = 0;
		}
		else if (deliveryCostPaidBySenderPartial) {
			dcFinal = diffDeliveryPartial;
		}
		else {
			dcFinal = totalDelivery;
		}
		
		if (orderRate != currentRATE) {
			packagePriceLBPCurrencyDollar = currentRATE * packagePriceInDollar;
		}
		else {
			packagePriceLBPCurrencyDollar = this.myCurrentOrder.packagePriceLBPCurrencyDollar;
		}

		//lastShowing

		if (packagePriceInLBP > 0 && isAndOrder && packagePriceInDollar == 0) {
			this.myCurrentOrder.orLL = true;
			this.myCurrentOrder.orUSD = false;

			this.conn.signatureData = this.receiver+ "Paid" + toBeCollectedFromReceiver + " LL";
			this.payll = this.conn.signatureData;
			this.payusd = 0;
		}
		else {
			if (packagePriceInLBP > 0 && isAndOrder && packagePriceInDollar > 0) { //ll > 0 AND USD > 0
				if (currentRATE == 0) {
					this.myCurrentOrder.orLL = false;
					this.myCurrentOrder.orUSD = true;

					//Show USD: toBeCollectedFromReceiver andCapital packagePriceInDollar
					this.conn.signatureData = this.receiver+ "Paid" + toBeCollectedFromReceiver + " LL" + andCapital + packagePriceInDollar + " $";
					this.payll = 0;
					this.payusd = this.conn.signatureData;
				}
				else {
					//Choose between LL or USD
					//Show LL:  toBeCollectedFromReceiver andCapital (packagePriceLBPCurrencyDollar)
					//Show USD: toBeCollectedFromReceiver andCapital packagePriceInDollar

					let totalLL: any = toBeCollectedFromReceiver + packagePriceLBPCurrencyDollar;

					this.payll = totalLL + " LL";
					this.payusd = toBeCollectedFromReceiver + " LL" + andCapital + packagePriceInDollar + " $";
				}
			}
			else if (packagePriceInLBP > 0 && !isAndOrder && packagePriceInDollar > 0) { //ll > 0 OR USD > 0
				//Choose between LL or USD
				//Show LL:  toBeCollectedFromReceiver ONLY
				//Show USD: packagePriceInDollar andCapital LL: dcFinal

				this.payll = toBeCollectedFromReceiver + " LL";

				if (dcFinal > 0) {
					this.payusd = dcFinal + " LL" + andCapital + packagePriceInDollar + " $";	
				}
				else {
					this.payusd = packagePriceInDollar + " $";
				}
			}
			else if (packagePriceInLBP == 0 && isAndOrder && packagePriceInDollar > 0) { //ll = 0 AND USD > 0
				if (currentRATE == 0) {
					this.myCurrentOrder.orLL = false;
					this.myCurrentOrder.orUSD = true;

					//Show USD: toBeCollectedFromReceiver andCapital packagePriceInDollar
					this.conn.signatureData = this.receiver+ "Paid" + toBeCollectedFromReceiver + " LL" + andCapital + packagePriceInDollar + " $";
					this.payll = 0;
					this.payusd = this.conn.signatureData;
				}
				else {
				//Choose between LL or USD
				//Show LL:  packagePriceLBPCurrencyDollar + dcFinal ONLY
				//Show USD: packagePriceInDollar andCapital LL: dcFinal
					
					let totalLL: any = packagePriceLBPCurrencyDollar + dcFinal;	
					
				this.payll = totalLL + " LL";
				
					if (dcFinal > 0) {
					this.payusd = dcFinal + " LL" + andCapital + packagePriceInDollar + " $";	
					}
					else {
						this.payusd = packagePriceInDollar + " $";
					}
				}
			}
			else if (packagePriceInLBP == 0 && !isAndOrder && packagePriceInDollar == 0) { //ll = 0 OR USD = 0
				if (dcFinal > 0) {
					//Show dcFinal ONLY
					this.conn.signatureData = this.receiver+ "Paid" + dcFinal + " LL";
					this.payll = this.conn.signatureData;
					this.payusd = 0;

					this.router.navigateByUrl('/signature');
				}
				else {
					this.myCurrentOrder.packagePricesAND = true;
					this.router.navigateByUrl('/signature');
				}
			}
			else if (packagePriceInLBP > 0 && !isAndOrder && packagePriceInDollar == 0) { //ll > 0 OR USD = 0
				this.myCurrentOrder.orLL = true;
				this.myCurrentOrder.orUSD = false;
				this.myCurrentOrder.packagePricesAND = true;

				//Show LL: toBeCollectedFromReceiver ONLY
				this.conn.signatureData = this.receiver+ "Paid" + toBeCollectedFromReceiver + " LL";
				this.payll = this.conn.signatureData;
				this.payusd = 0;
			}
			else if (packagePriceInLBP == 0 && isAndOrder && packagePriceInDollar == 0) { //ll = 0 AND USD = 0
				if (dcFinal > 0) {
					//Show dcFinal ONLY
					this.conn.signatureData = this.receiver+ "Paid" + dcFinal + " LL";
					this.payll = this.conn.signatureData;
					this.payusd = 0;
					
					this.router.navigateByUrl('/signature');
				}
				else {
					this.router.navigateByUrl('/signature');
				}
			}
			else if (packagePriceInLBP == 0 && !isAndOrder && packagePriceInDollar == 0) { //ll = 0 OR USD = 0
				if (dcFinal > 0) {
					//Show dcFinal ONLY
					this.conn.signatureData = this.receiver+ "Paid" + dcFinal + " LL";
					this.payll = this.conn.signatureData;
					this.payusd = 0;

					this.router.navigateByUrl('/signature');
				}
				else {
					this.router.navigateByUrl('/signature');
				}
			}
		}

		this.conn.packagePriceLBPCurrencyDollar = packagePriceLBPCurrencyDollar;
		this.conn.orderRate 			       	 			= currentRATE;
		this.conn.packagePricesAND						  = this.myCurrentOrder.packagePricesAND;
		this.conn.payLLOrder 										= this.myCurrentOrder.orLL;
		this.conn.payUSDOrder 									= this.myCurrentOrder.orUSD;

		if (this.myCurrentOrder.orLL) {
			this.paymentMethod('ll');
		}
		else if (this.myCurrentOrder.orUSD) {
			this.paymentMethod('usd');
		}
		else {
			this.showChooser = true;
		}
      });
	}

	paymentMethod(typeOfPayment){
		if (typeOfPayment === 'll') {
			this.conn.signatureData = this.receiver+ "Paid" + this.payll;

			this.conn.payLLOrder 										= true;
			this.conn.payUSDOrder 									= false;

			this.navigate('signature')
		}
		if (typeOfPayment === 'usd') {
			this.conn.signatureData = this.receiver+ "Paid" + this.payusd;

			this.conn.payLLOrder 										= false;
			this.conn.payUSDOrder 									= true;

			this.navigate('signature')
		}
	}

  navigate(text: any) {
    if (text === 'home') {
      this.router.navigateByUrl('/home');
      this.conn.getUserData(true);
    }
		if (text === 'signature') {
			this.router.navigateByUrl('/signature');
    }
  }
}
