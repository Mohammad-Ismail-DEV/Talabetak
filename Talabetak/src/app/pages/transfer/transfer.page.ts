import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CodeScanner } from '../../services/BarcodeScanner';
import { Connections } from '../../services/connections';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.page.html',
  styleUrls: ['./transfer.page.scss'],
})
export class TransferPage implements OnInit {
	ngOnInit() {
		this.initt();
	}
	
	initt() {
		this.showLoader = true
    if (localStorage.getItem("token") === null) {
			this.conn.signOut();
			this.showLoader = false;
		} else {
			
			if (this.conn.signedddd == false) {
				let data = { "class": this.class,"receivingBranch": this.receivingBranch,"receivingWarehouse": this.receivingWarehouse,"status": this.status }
				localStorage.setItem("transferData", JSON.stringify(data))
				
				this.conn.findTransferByTrackId(localStorage.getItem("trackId"));	
			}
			else {
				this.conn.signedddd = false;
			}

			this.items = JSON.parse(localStorage.getItem("transfer"));

			if (this.items) {
				if (this.items.isShown) {
					this.isShown = this.items.isShown;
				}
				else {
					this.isShown = false;
				}
				
				let transferType: any = this.conn.transferType;
				let statusFinal: any = [];

				if (transferType === 'Transport Transfer') {
					statusFinal = ['100000097'];
				}
				if (this.transferType === 'Delivery Transfer') {
					statusFinal = ['100000100'];
				}
				if (this.transferType === 'Return Transfer') {
					statusFinal = ['100000101'];
				}
				if (this.transferType === 'Pickup Transfer') {
					statusFinal = ['100000099', '100002027'];
				}

				if (this.items.myMap && this.items.myMap.length > 0) {
					this.mapOrders = this.items.myMap.map((order) => ({
						id: order.order.id,
						text: order.order.orderTrackId,
						done: this.conn.getValueStatus(String(order.order.status.lookupType), statusFinal)
					}));

					

					for (let index = 0; index < this.mapOrders.length; index++) {
						const element = this.mapOrders[index];
						if (element && element.id == this.conn.orderId) {
							element.done = true;
							break;
						}
					}
				}
				else {
					this.mapOrders = this.items.ordersView.map((order) => ({
						id: order.order.id,
						text: order.order.orderTrackId,
						done: this.conn.getValueStatus(String(order.order.status.lookupType), statusFinal)
					}));
				}

				
				
			}
			else {
				this.isShown = false;
				this.mapOrders = null;
			}

			
			this.showLoader = false;
		}
	}

  signOut() {
    this.conn.signOut();
  }

  constructor(
    private codeScanner: CodeScanner,
    private conn: Connections,
		private router: Router,
		private route: ActivatedRoute,
		private toastController: ToastController
	) {
		route.params.subscribe(val => {
			this.initt();
		})
	}

	mapOrders: any = [];
	public showLoader = true
  public transferType = this.conn.transferType;
  public trackId = this.conn.trackId;
  public transfer = JSON.parse(localStorage.getItem("transfer"));
  
  public username = localStorage.getItem("userName");
  public title = localStorage.getItem("title");
  public data: any;
  public items = JSON.parse(localStorage.getItem("transfer")).ordersView;
  public receivingBranch: any;
  public receivingWarehouse: any;
  public isShown = false;
  public class = 'page';
  public status = [];
  public coverImage = localStorage.getItem("coverImage");;

  navigate(text) {
    if (text === 'home') {
      this.router.navigateByUrl('/home');
      this.conn.getUserData(true);
    }
  }

 

	async getOrder(Order) {
    if (!Order.done) {
			this.showLoader = true
			localStorage.setItem("orderId", Order.id)
			this.conn.findOrderByTrackId(Order.text);
			
			this.conn.getCompanyUSDMainRate();
		} else {
			const toast = await this.toastController.create({
			message: 'This Order is Done',
			duration: 3000,
			color: 'danger',
		});
		toast.present();
		}
  }

  scan() {
    this.codeScanner.scanCode();
  }
}
