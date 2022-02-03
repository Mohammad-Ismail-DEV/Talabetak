import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from 'src/app/services/location';
import { Connections } from '../../services/connections';

@Component({
  selector: 'app-transport-order',
  templateUrl: './transport-order.page.html',
  styleUrls: ['./transport-order.page.scss'],
})
export class TransportOrderPage implements OnInit {
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
    private location: Location
  ) {}

  public orderType = this.conn.orderType + ' Order';
  public trackId = this.conn.orderTrackId;
  public orderId = this.conn.orderOrderId;
  public receiver = JSON.parse(localStorage.getItem("order")).receiver.teamMember.fullName;
  public receiverPhoneNumber = JSON.parse(localStorage.getItem("order")).receiver.teamMember.telephone;
  public sender = JSON.parse(localStorage.getItem("order")).sender.teamMember.fullName;
  
  public username = localStorage.getItem("userName");
  public title = localStorage.getItem("title");
  public data: any;
  public coverImage = localStorage.getItem("coverImage");;

  navigate(text) {
    if (text === 'home') {
      this.router.navigateByUrl('/home');
      this.conn.getUserData(true);
    }
  }
}
