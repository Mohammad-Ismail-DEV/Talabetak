import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CodeScanner } from '../../services/BarcodeScanner';
import { Connections } from '../../services/connections';

@Component({
  selector: 'app-pickup',
  templateUrl: './transfers.page.html',
  styleUrls: ['./transfers.page.scss'],
})
export class TransfersPage implements OnInit {
  transfers:any;
	ngOnInit() {
		this.showLoader = false
		if (localStorage.getItem("token") === null) {
			this.conn.signOut();
		} else {
			this.conn.changeTransfersType(localStorage.getItem("transfersType").charAt(0).toLocaleLowerCase() +localStorage.getItem("transfersType").slice(1).split(' ')[0])
			this.items= JSON.parse(localStorage.getItem('transfers'));
			this.mapTransfers();
			localStorage.removeItem("trackId")

		}
  }

  signOut() {
    this.conn.signOut();
  }

  constructor(
    private codeScanner: CodeScanner,
    private conn: Connections,
		private router: Router,
		private route: ActivatedRoute
	) {
		route.params.subscribe(val => {
		this.showLoader = false
		if (localStorage.getItem("token") === null) {
			this.conn.signOut();
		} else {
			this.conn.changeTransfersType(localStorage.getItem("transfersType").charAt(0).toLocaleLowerCase() +localStorage.getItem("transfersType").slice(1).split(' ')[0])
			this.items= JSON.parse(localStorage.getItem('transfers'));
			this.mapTransfers();
			localStorage.removeItem("trackId")
		}
	})}

	public showLoader = false;
	public count = 0;
  public transfersType = localStorage.getItem("transfersType");
  public username = localStorage.getItem("userName");
  public title = localStorage.getItem("title");
  public items = JSON.parse(localStorage.getItem('transfers'));
  public coverImage = localStorage.getItem("coverImage");

  navigate(text) {
    if (text === 'home') {
      this.router.navigateByUrl('/home');
      this.conn.getUserData(true);
    }
  }

	mapTransfers() {		
		if (this.items != undefined && this.items != null && this.items != {}) {
			return this.items.map((transfer) => ({
		id: transfer.id,
		text: transfer.orderTransferTrackId,
	}))
		} else {
			
		};
	
  }

	transfer(trackId) {
		this.showLoader = true
		localStorage.setItem("trackId", trackId)
    this.conn.findTransferByTrackId(localStorage.getItem("trackId"));
  }

  scan() {
    this.codeScanner.scanCode();
  }
}
