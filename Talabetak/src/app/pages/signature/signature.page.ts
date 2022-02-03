import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Location } from 'src/app/services/location';
import { Connections } from '../../services/connections';
import { Router } from '@angular/router';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
})
export class SignaturePage implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) signaturePadElement: any;
  signaturePad: any;
	ngOnInit() {
    if (localStorage.getItem("token") === null) {
      this.conn.signOut();
    }
    this.init();
  }

  signOut() {
    this.conn.signOut();
  }

  constructor(
    private conn: Connections,
    private router: Router,
    private location: Location,
		private elementRef: ElementRef,
  ) {}

  
  public username = localStorage.getItem("userName");
  public title = localStorage.getItem("title");
	public coverImage = localStorage.getItem("coverImage");
  public trackId = this.conn.orderTrackId;
  public orderId = this.conn.orderOrderId;
  public orderType = this.conn.orderType + ' Order';
  public signature: any;
  public order = JSON.parse(localStorage.getItem("order"));
	public signatureData = this.conn.signatureData;
	public showLoader = false
	public transferData= JSON.parse(localStorage.getItem("transferData"))

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.init();
  }

  init() {
    const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 140;
    if (this.signaturePad) {
      this.signaturePad.clear(); // Clear the pad on init
    }
  }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(
      this.signaturePadElement.nativeElement
    );
    this.signaturePad.clear();
    this.signaturePad.penColor = 'black';
  }

  isCanvasBlank() {
    if (this.signaturePad) {
      return this.signaturePad.isEmpty() ? true : false;
    }
  }

  clear() {
    this.signaturePad.clear();
  }

  async save() {
    const img = this.signaturePad.toDataURL();
		await this.maps();
		console.log({img})
    this.signature = img.replace('data:image/png;base64,', '');
    if (this.conn.orderType === 'Pickup') {
      this.order.order.senderAddress.latitude = this.conn.latitude;
      this.order.order.senderAddress.longitude = this.conn.longitude;
      this.order.order.pickupSignature = this.signature;
      this.conn.setPickedUP();
      this.clear();
			this.showLoader = true
			this.conn.findTransferByTrackIdSign(localStorage.getItem("trackId"),this.transferData.class, this.transferData.receivingBranch, this.transferData.receivingWarehouse, this.transferData.status);
    }
    if (this.conn.orderType === 'Delivery') {
      this.order.order.receiverAddress.latitude = this.conn.latitude;
      this.order.order.receiverAddress.longitude = this.conn.longitude;
			this.order.order.deliverySignature = this.signature;
			this.order.order.orLL = this.conn.payLLOrder;
			this.order.order.orUSD = this.conn.payUSDOrder;
			this.order.order.packagePriceLBPCurrencyDollar = this.conn.packagePriceLBPCurrencyDollar;
			this.order.order.orderRate = this.conn.orderRate;
			this.order.order.packagePricesAND = this.conn.packagePricesAND;
      this.conn.setDelivered();
			this.clear();
			this.showLoader = true
			this.conn.findTransferByTrackIdSign(localStorage.getItem("trackId"),this.transferData.class, this.transferData.receivingBranch, this.transferData.receivingWarehouse, this.transferData.status); 
    }
    if (this.conn.orderType === 'Return') {
      this.order.order.receiverAddress.latitude = this.conn.latitude;
      this.order.order.receiverAddress.longitude = this.conn.longitude;
      this.order.order.returnSignature = this.signature;
      this.conn.setReturned();
      this.clear();
			this.showLoader = true
			this.conn.findTransferByTrackIdSign(localStorage.getItem("trackId"),this.transferData.class, this.transferData.receivingBranch, this.transferData.receivingWarehouse, this.transferData.status);
    }
		if (this.conn.orderType === 'OPU Pickup') {
			this.order.order.senderAddress.latitude = this.conn.latitude;
			this.order.order.senderAddress.longitude = this.conn.longitude;
			this.order.order.opuPickupSignature = this.signature;
			this.conn.setClosedOPU();
			this.clear();
			this.showLoader = true
			this.conn.findTransferByTrackIdSign(localStorage.getItem("trackId"),this.transferData.class, this.transferData.receivingBranch, this.transferData.receivingWarehouse, this.transferData.status);
		}
  }

  async maps() {
    await this.location.checkGPSPermission();
  }
  navigate(text) {
		if (text === 'home') {
      this.router.navigateByUrl('/home');
      this.conn.getUserData(true);
    }
  }
}
