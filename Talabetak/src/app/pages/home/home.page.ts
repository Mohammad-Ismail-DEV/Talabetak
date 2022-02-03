import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Connections } from '../../services/connections';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
	ngOnInit() {
		this.showLoader = false
		this.refresh()
		localStorage.removeItem("transfers")
    if (localStorage.getItem("token") === null) {
      this.conn.signOut();
		};
  }

	public showData: boolean = false;
	public count = 0
	public showLoader = false


	setValues() {
    this.pickupCount = localStorage.getItem("pickupCount");;
    this.deliveryCount = localStorage.getItem("deliveryCount");;
    this.returnCount = localStorage.getItem("returnCount");;
    this.transportCount = localStorage.getItem("transportCount");
    this.username = localStorage.getItem("userName");
    this.title = localStorage.getItem("title");
		this.coverImage = localStorage.getItem("coverImage");
		if (JSON.parse(localStorage.getItem("loader")) === false) {
			this.showLoader = false
		}
		//setTimeout(() => {
		//	this.showLoader = false
		//}, 2000); 
	}

	async refresh() {
		localStorage.setItem("loader", "true")
		this.showLoader = true
		await this.getUserData(true);
		//this.setValues()
		while (this.username == undefined && this.count >100){
			this.refresh()
			this.count +=1
		}
		this.showData = true
	}
	
	async getUserData(refresh) {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .get<any>(this.conn.baseUrl + '/settings/auth/getInitialData/', {
        headers,
      })
			.subscribe(async (data) => {
				this.conn.member = data.teamMember;
				localStorage.setItem("userName", data.teamMember.fullName)
        this.conn.userName = data.teamMember.fullName;
        this.conn.driverId = data.teamMember.id;
				localStorage.setItem("title", data.typeOfConnectedUser)
        this.title = data.typeOfConnectedUser;
				this.getTransfers(refresh);
      });
	}
	
	async getTransfers(refresh) {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .post<any>(
        this.conn.baseUrl + '/ordermngmt/ordermobile/findDetailsTransfersDriver/',
        this.conn.member,
        { headers: headers }
      )
			.subscribe(async (data) => {
				localStorage.setItem("pickupCount", data.countPickupForDriver);
				localStorage.setItem("deliveryCount", data.countDeliveryForDriver);
				localStorage.setItem("returnCount", data.countReturnForDriver);
				localStorage.setItem("transportCount", data.countTransportForDriver);
				this.getBase64ImageTM(refresh);
      });
	}
	
	async getBase64ImageTM(refresh) {
    var headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http
      .post<any>(
        this.conn.baseUrl + '/ordermngmt/ordermobile/getBase64ImageTM',
        this.conn.member,
        { headers: headers }
      )
      .subscribe(async (data) => {
        if (data !== 'null') {
          localStorage.setItem("coverImage" ,'data:image/jpg;base64,' + data);
        } else {
          localStorage.setItem("coverImage" ,'../../assets/images/profile.png');
				}
				this.conn.getCompanyUSDMainRate()
				if (refresh === true) {
					const toast = await this.conn.toastController.create({
						message: 'Refreshed',
						duration: 1000,
						color: 'danger',
					});
					localStorage.setItem("loader", "false")
					this.setValues()
					toast.present();
				} else {
					return
				}
      });
	}

  signOut() {
    this.conn.signOut();
  }

	constructor(private route: ActivatedRoute, private conn: Connections,
    private http: HttpClient,) {
		route.params.subscribe(val => {
			this.showLoader = false
			this.refresh()
			localStorage.removeItem("transfers")
			if (localStorage.getItem("token") === null) {
				this.conn.signOut();
			};
		})
	}
	public navigate(text) {
		this.showLoader = true
		localStorage.setItem("transfersType", text.charAt(0).toUpperCase() + text.slice(1) + " Transfers")
    this.conn.changeTransfersType(text);
  }

	public pickupCount = localStorage.getItem("pickupCount");;
  public deliveryCount = localStorage.getItem("deliveryCount");;
  public returnCount = localStorage.getItem("returnCount");;
  public transportCount = localStorage.getItem("transportCount");
  public username = localStorage.getItem("userName");
  public title = localStorage.getItem("title");
	public coverImage = localStorage.getItem("coverImage");	

}
