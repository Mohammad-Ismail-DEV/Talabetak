import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Connections } from '../../services/connections';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{
	ngOnInit() {
			this.showLoader = true
			var headers: HttpHeaders = new HttpHeaders();
			headers = headers.append('Content-Type', 'application/json');
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
					this.showLoader = false
				});
  }

	public baseUrl = this.conn.baseUrl

	constructor(private conn: Connections,
    private http: HttpClient, private route: ActivatedRoute, 
		public toastController: ToastController,) {
		route.params.subscribe(
			val=> {
			this.showLoader = true
			var headers: HttpHeaders = new HttpHeaders();
			headers = headers.append('Content-Type', 'application/json');
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
					this.showLoader = false
				});
		})	}
	
	public companyImage: any;
	public showLogo = this.conn.showLogo
	public showLoader = false

  async handleLogin(event) {
    var username: String = event.target.username.value;
    var password: String = event.target.password.value;
		var data = { username, password };
		
		await this.login(data);
	}


	login(data) {
    var headers: HttpHeaders = new HttpHeaders();
    this.http
      .post<any>(this.baseUrl + '/settings/auth/loginMobileTalabetak/', data, {
        headers,
      })
      .subscribe(
				async (data) => {
					localStorage.setItem("token", data.idToken)
					if (data.idToken == undefined) {
						this.showLoader = false
            const toast = await this.toastController.create({
              message: data,
              duration: 3000,
              color: 'danger',
            });
            toast.present();
          } else {
						await this.conn.getUserData(false);
          }
        },
        (error) => {
          alert(error.error.message);
        }
      );
  }
	
	async loader(event) {
		this.showLoader = true
		await this.handleLogin(event)
  }
}

