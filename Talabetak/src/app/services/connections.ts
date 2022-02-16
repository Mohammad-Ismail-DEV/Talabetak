import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';



@Injectable({
  providedIn: 'root',
})
export class Connections {
  constructor(
    private router: Router,
    private http: HttpClient,
		public toastController: ToastController,
		private route: ActivatedRoute
	) {
		route.params.subscribe(val => {
			this.getBase64ImageTMCompanyLogo()
		})
	}
	//Base App Url
	public baseUrl = 'https://talabetak-preproduction.talabetakmobile.com/pm4pi-portal';
	//public baseUrl = 'https://talabetak-preproduction.talabetakmobile.com/pm4pi-portal';

  public signatureData: any;
  public coverImage: any = new Image();
  public companyImage: any =   new Image() ;
  public listScreenShots: any = [];
  public orderId: any;
	public driverId: any;
	public signedddd: boolean = false;
  public trackId: any;
  public userName: any;
  public token: any;
  public title: any;
  public member: any;
  public transfers: any;
  public transfer: any;
	public order: any;

	public payLLOrder: boolean = false;
	public payUSDOrder: boolean = false;
	public packagePriceLBPCurrencyDollar: any;
	public orderRate: any;
	public packagePricesAND: boolean;
	
  public driverPickups: any;
  public driverDeliveries: any;
  public driverReturns: any;
  public driverTransports: any;
  public pickupCount: any;
  public deliveryCount: any;
	public returnCount: any;
	public currentCompanyRate: any;
  public transportCount: any;
  public transferTypes = {
    PIC: 'Pickup Transfer',
    DEL: 'Delivery Transfer',
    RET: 'Return Transfer',
    TRA: 'Transport Transfer',
  };
  public transferType: any;
  public transfersType: any;
  public orderType: any;
	public orderTrackId: any;
	public orderOrderId: any;
  public opuOrders: any = [];
  public latitude: any;
	public longitude: any;
	public showLogo = false;

  changeTransfersType(text) {
    if (text === 'pickup') {
			this.transfersType = 'Pickup Transfers';
			if (localStorage.getItem("transfers") == null || localStorage.getItem("transfers") == undefined ) {
				this.findPickupTransferByDriver()
			}else {
				this.router.navigateByUrl('/transfers')
			};

    }
    if (text === 'delivery') {
			this.transfersType = 'Delivery Transfers';
			if (localStorage.getItem("transfers") == null || localStorage.getItem("transfers") == undefined ) {
				this.findDeliveryTransferByDriver()
			}else {
				
				this.router.navigateByUrl('/transfers')
			};
    }
    if (text === 'return') {
      this.transfersType = 'Return Transfers';
			if (localStorage.getItem("transfers") == null || localStorage.getItem("transfers") == undefined ) {
				this.findReturnTransferByDriver()
			}else {
				
				this.router.navigateByUrl('/transfers')
			};
    }
    if (text === 'transport') {
      this.transfersType = 'Transport Transfers';
			if (localStorage.getItem("transfers") == null || localStorage.getItem("transfers") == undefined ) {
				this.findTransportTransferByDriver()
			}else {
				
				this.router.navigateByUrl('/transfers')
			};
		}
		
  }

  async getUserData(refresh) {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .get<any>(this.baseUrl + '/settings/auth/getInitialData/', {
        headers,
      })
			.subscribe(async (data) => {
				this.member = data.teamMember;
				localStorage.setItem("userName", data.teamMember.fullName)
        this.userName = data.teamMember.fullName;
        this.driverId = data.teamMember.id;
				localStorage.setItem("title", data.typeOfConnectedUser)
        this.title = data.typeOfConnectedUser;
        if (data.typeOfConnectedUser === 'DRIVER') {
          this.getTransfers(refresh);
        } else {
          const toast = await this.toastController.create({
            message: 'You Are Not Allowed To Connect',
            duration: 3000,
            color: 'danger',
          });
          toast.present();
        }
      });
  }

	async getCompanyUSDMainRate() {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .get<any>(this.baseUrl + '/ordermngmt/ordermobile/getCompanyUSDMainRate/', {
        headers,
      })
			.subscribe(async (data) => {
				this.currentCompanyRate = data;
      });
  }

  async getTransfers(refresh) {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .post<any>(
        this.baseUrl + '/ordermngmt/ordermobile/findDetailsTransfersDriver/',
        this.member,
        { headers: headers }
      )
			.subscribe(async (data) => {
				localStorage.setItem("pickupCount", data.countPickupForDriver);
				this.pickupCount = data.countPickupForDriver;
				localStorage.setItem("deliveryCount", data.countDeliveryForDriver);
				this.deliveryCount = data.countDeliveryForDriver;
				localStorage.setItem("returnCount", data.countReturnForDriver);
				this.returnCount = data.countReturnForDriver;
				localStorage.setItem("transportCount", data.countTransportForDriver);
        this.transportCount = data.countTransportForDriver;
				this.getBase64ImageTM(refresh);
      });
  }

  async getBase64ImageTM(refresh) {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .post<any>(
        this.baseUrl + '/ordermngmt/ordermobile/getBase64ImageTM',
        this.member,
        { headers: headers }
      )
      .subscribe(async (data) => {
        if (data !== 'null') {
          localStorage.setItem("coverImage" ,'data:image/jpg;base64,' + data);
        } else {
          localStorage.setItem("coverImage" ,'../../assets/images/profile.png');
				}
				this.getCompanyUSDMainRate()
				await this.router.navigateByUrl(`/home`);
				
      });
	}
	

	async getBase64ImageTMCompanyLogo() {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .post<any>(
        this.baseUrl + '/ordermngmt/ordermobile/getBase64ImageTMCompanyLogo',
        { headers: headers }
      )
			.subscribe(async (data) => {
        if (data !== 'null') {
					this.companyImage = 'data:image/jpg;base64,' + data;
        } else {
          this.companyImage = '../../assets/images/logo.png';
				}
				
				this.showLogo = true;
      });
  }


	
	async findPickupTransferByDriver() {
		console.log("trying my best")
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .post<any>(
        this.baseUrl + '/ordermngmt/ordermobile/findPickupTransferByDriver',
        this.member,
        { headers: headers }
      )
			.subscribe(async (data) => {
				localStorage.setItem('transfers',JSON.stringify(data));
				this.changeTransfersType(localStorage.getItem("transfersType").charAt(0).toLocaleLowerCase() +localStorage.getItem("transfersType").slice(1).split(' ')[0])
      });
  }

  async findDeliveryTransferByDriver() {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    await this.http
      .post<any>(
        this.baseUrl + '/ordermngmt/ordermobile/findDeliveryTransferByDriver',
        this.member,
        { headers: headers }
      )
			.subscribe(async (data) => {
				localStorage.setItem('transfers',JSON.stringify(data));
				this.changeTransfersType(localStorage.getItem("transfersType").charAt(0).toLocaleLowerCase() +localStorage.getItem("transfersType").slice(1).split(' ')[0])
      });
  }

  async findReturnTransferByDriver() {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .post<any>(
        this.baseUrl + '/ordermngmt/ordermobile/findReturnTransferByDriver',
        this.member,
        { headers: headers }
      )
			.subscribe(async (data) => {
				localStorage.setItem('transfers', JSON.stringify(data));
				this.changeTransfersType(localStorage.getItem("transfersType").charAt(0).toLocaleLowerCase() +localStorage.getItem("transfersType").slice(1).split(' ')[0])
      });
  }

  async findTransportTransferByDriver() {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    await this.http
      .post<any>(
        this.baseUrl + '/ordermngmt/ordermobile/findTransportTransferByDriver',
        this.member,
        { headers: headers }
      )
			.subscribe(async (data) => {
				localStorage.setItem('transfers',JSON.stringify(data));
				this.changeTransfersType(localStorage.getItem("transfersType").charAt(0).toLocaleLowerCase() +localStorage.getItem("transfersType").slice(1).split(' ')[0])
      });
	}
	
	getValueStatus(statusOrderLookupType, status) {
    if (statusOrderLookupType) {
      if (status) {
        for (let index = 0; index < status.length; index++) {
          const element = status[index];

          if (String(element) == statusOrderLookupType) {
            return true;
          }
        }
      }
    }

    return false;
  }
	
	mapOrders(myData,trackId, transferType, classs, receivingBranch, receivingWarehouse,status) {
		let isShown: boolean = false;
		let items: any = myData.ordersView;
		
		if (trackId !== this.trackId) {
      trackId = this.trackId;
      transferType = this.transferType;
    }
    if (transferType === 'Transport Transfer') {
      isShown
      classs = 'transportClass';
      receivingBranch =
        JSON.parse(localStorage.getItem("transfer")).transferToWarehouse.branch.value.en;
      receivingWarehouse =
        JSON.parse(localStorage.getItem("transfer")).transferToWarehouse.warehouseNameEN;
      status = ['100000097'];
    }
    if (this.transferType === 'Delivery Transfer') {
      status = ['100000100'];
    }
    if (this.transferType === 'Return Transfer') {
      status = ['100000101'];
    }
    if (this.transferType === 'Pickup Transfer') {
      status = ['100000099', '100002027'];
    }
		
		let statusFinal: any = status;
		
		items.isShown = isShown;
		items.map((order) => ({
      id: order.order.id,
      text: order.order.orderTrackId,
			done: this.getValueStatus(String(order.order.status.lookupType), statusFinal),
		}));
		
		return items;
  }

	findTransferByTrackId(trackId) {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .get<any>(
        this.baseUrl +
          '/ordermngmt/findordertransfer/getOrderTransferByTrackId/' +
          trackId,
        { headers: headers }
      )
      .subscribe(async (data) => {
        if (data === null) {
          const toast = await this.toastController.create({
            message: 'Transfer Not Available',
            duration: 3000,
            color: 'danger',
          });
          toast.present();
        } else {
          for (var i = 0; i < data.ordersView.length; i++) {
            var sortOrder = data.ordersView[i].order;
            if (String(sortOrder.orderTrackId).includes('OPU')) {
              this.opuOrders.push(data.ordersView[i]);
            }
          }

          this.trackId = data.orderTransferTrackId;
          this.transferType =
						this.transferTypes[data.orderTransferTrackId.substring(0, 3)];
					localStorage.setItem("transfer", JSON.stringify(data))
          this.transfer = data;
 
          if (this.transfer.transferDriver.id !== this.driverId) {
            const toast = await this.toastController.create({
              message: 'Not Correct Driver',
              duration: 3000,
              color: 'danger',
            });
            toast.present();
          } else if (this.transfer.statusTransfer.lookupType !== 100002095) {
            const toast = await this.toastController.create({
              message: 'not started transfer',
              duration: 3000,
              color: 'danger',
            });
            toast.present();
          } else {
            this.router.navigateByUrl('/transfer');
          }
        }
      });
  }

	findTransferByTrackIdSign(trackId, classs, receivingBranch, receivingWarehouse,status){
		let items: any = {};

    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .get<any>(
        this.baseUrl +
          '/ordermngmt/findordertransfer/getOrderTransferByTrackId/' +
          trackId,
        { headers: headers }
      )
      .subscribe(async (data) => {
        if (data === null) {
          const toast = await this.toastController.create({
            message: 'Transfer Not Available',
            duration: 3000,
            color: 'danger',
          });
          toast.present();
        } else {
          for (var i = 0; i < data.ordersView.length; i++) {
            var sortOrder = data.ordersView[i].order;
            if (String(sortOrder.orderTrackId).includes('OPU')) {
              this.opuOrders.push(data.ordersView[i]);
            }
          }

          this.trackId = data.orderTransferTrackId;
          this.transferType =
						this.transferTypes[data.orderTransferTrackId.substring(0, 3)];
					localStorage.setItem("transfer", JSON.stringify(data))
          this.transfer = data;
 
          if (this.transfer.transferDriver.id !== this.driverId) {
            const toast = await this.toastController.create({
              message: 'Not Correct Driver',
              duration: 3000,
              color: 'danger',
            });
            toast.present();
          } else if (this.transfer.statusTransfer.lookupType !== 100002095) {
            const toast = await this.toastController.create({
              message: 'not started transfer',
              duration: 3000,
              color: 'danger',
            });
            toast.present();
					} else {
						data.myMap = this.mapOrders(data, this.trackId, this.transferType, classs, receivingBranch, receivingWarehouse, status);
						for (let index = 0; index < data.myMap.length; index++) {
							const element = data.myMap[index];
							
							if (element && element.id == this.orderId) {
								element.done = true;
								break;
							}
						}
						
						this.signedddd = true;

						localStorage.setItem("transfer", JSON.stringify(data));
						this.router.navigateByUrl('/transfer');
					}
					localStorage.setItem("transfer", JSON.stringify(data));
				}
      });
  }

  findOrderByTrackId(trackId) {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .get<any>(
        this.baseUrl + '/ordermngmt/findorder/getOrderByTrackId/' + trackId,
        { headers: headers }
      )
      .subscribe(async (data) => {
        if (data === null) {
          const toast = await this.toastController.create({
            message: 'Order Not Available',
            duration: 3000,
            color: 'danger',
          });
          toast.present();
        } else {
          this.orderTrackId = this.trackId;
					this.orderOrderId = data.order.orderTrackId;
					localStorage.setItem("order", JSON.stringify(data))
					this.orderId = JSON.parse(localStorage.getItem("order")).order.id;
          if (
            String(JSON.parse(localStorage.getItem("order")).order.orderTrackId).toLowerCase().includes('opu')
          ) {
            this.router.navigateByUrl('/opu-order');
            this.orderType = 'OPU Pickup';
          } else {
            if (this.transferType === 'Pickup Transfer') {
              this.router.navigateByUrl('/pickup-order');
              this.orderType = 'Pickup';
            }
            if (this.transferType === 'Delivery Transfer') {
              this.router.navigateByUrl('/delivery-order');
              this.orderType = 'Delivery';
            }
            if (this.transferType === 'Return Transfer') {
              this.router.navigateByUrl('/return-order');
              this.orderType = 'Return';
            }
            if (this.transferType === 'Transport Transfer') {
              this.router.navigateByUrl('/transport-order');
              this.orderType = 'Transport';
            }
          }
        }
      });
  }

  setPickedUP(order) {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    let listOrders: any = [];
    listOrders.push(order.order);
    let dto: any = {
      orders: listOrders,
      transferTrackId: String(this.trackId),
		};
    this.http
      .post<any>(
        this.baseUrl + '/ordermngmt/ordermobile/setPickedUP',
        dto,
        { headers: headers }
      )
      .subscribe(async (data) => {});
  }

  setDelivered(order) {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    let listOrders: any = [];
    listOrders.push(order.order);
    let dto: any = {
      orders: listOrders,
      transferTrackId: this.trackId,
    };
    this.http
      .post<any>(
        this.baseUrl + '/ordermngmt/ordermobile/setDeliveredOrder',
        dto,
        { headers: headers }
      )
      .subscribe(async (data) => {});
  }

  setReturned(order) {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));

    let listOrders: any = [];
    listOrders.push(order.order);
    let dto: any = {
      orders: listOrders,
      returned: true,
      receivingWarehouse: this.transfer.transferToWarehouse,
      transferTrackId: this.trackId,
    };
    this.http
      .post<any>(
        this.baseUrl + '/ordermngmt/ordermobile/setReturnedOrder',
        dto,
        { headers: headers }
      )
      .subscribe(async (data) => {});
  }

  setClosedOPU(order) {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
		let dto = { order: order.order, transferTransferTrackId: this.trackId }
    this.http
      .post<any>(
        this.baseUrl + '/ordermngmt/ordermobile/setClosedOPU',
        dto,
        { headers: headers }
      )
      .subscribe((data) => {});
  }

	addScreenShotToOrder(result: any) {
		console.log(result)
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
		let object = {
			order: JSON.parse(localStorage.getItem("order")).order,
			transferTransferTrackId: this.trackId,
			listScreenShots: result,
		}
		console.log({object})
    this.http
			.post<any>(
				this.baseUrl + '/ordermngmt/ordermobile/addScreenShotToOrder',
				object,
				//"http://remixcode.com/services/public/api/saveRequest",
        //result[0],
        { headers: headers }
      )
      .subscribe((data) => {});
  }

  signOut() {
    this.coverImage = new Image();
    this.listScreenShots = [];
    this.orderId = '';
    this.driverId = '';
    this.trackId = '';
    this.userName = '';
    this.token = '';
    this.title = '';
    this.member = {};
    this.transfers = {};
    this.transfer = {};
    this.order = {} ;
    this.driverPickups = {};
    this.driverDeliveries = {};
    this.driverReturns = {};
    this.driverTransports = {};
    this.pickupCount = 0;
    this.deliveryCount = 0;
    this.returnCount = 0;
    this.transportCount = 0;
    this.transferType = '';
    this.transfersType = '';
    this.orderType = '';
    this.orderTrackId = '';
    this.opuOrders = [];
    this.latitude = '';
		this.longitude = '';
		this.payLLOrder = false;
		this.payUSDOrder = false;
		this.packagePriceLBPCurrencyDollar= 0;
		this.orderRate = "";
		this.packagePricesAND = false;

		localStorage.clear()
		
    this.router.navigateByUrl('/login');
  }
}
