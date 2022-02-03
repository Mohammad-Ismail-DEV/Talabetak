import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { ToastController } from '@ionic/angular';
import { Connections } from './connections';
@Injectable({
  providedIn: 'root',
})
export class Location {
  locationCoords: any;
  timetest: any;
  constructor(
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    public toastController: ToastController,
    private locationAccuracy: LocationAccuracy,
    private conn: Connections
  ) {
    this.locationCoords = {
      latitude: '',
      longitude: '',
      accuracy: '',
      timestamp: '',
    };
    this.timetest = Date.now();
  }

  //Check if application having GPS access permission
  async checkGPSPermission() {
    try {
      const result = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
      );
      if (result.hasPermission) {
        //If having permission show 'Turn On GPS' dialogue
        this.askToTurnOnGPS();
      } else {
        //If not having permission ask for permission
        await this.requestGPSPermission();
      }
    } catch (err) {
      alert(err);
    }
  }

  async requestGPSPermission() {
    await this.locationAccuracy
      .canRequest()
      .then(async (canRequest: boolean) => {
        if (canRequest) {
        } else {
          //Show 'GPS Permission Request' dialogue
          await this.androidPermissions
            .requestPermission(
              this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
            )
            .then(
              async () => {
                // call method to turn on GPS
                await this.askToTurnOnGPS();
              },
              (error) => {
                //Show alert if user click on 'No Thanks'
                alert(
                  'requestPermission Error requesting location permissions ' +
                    error
                );
              }
            );
        }
      });
  }

  async askToTurnOnGPS() {
    await this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        async () => {
          // When GPS Turned ON call method to get Accurate location coordinates
          await this.getLocationCoordinates();
        },
        (error) =>
          alert(
            'Error requesting location permissions ' + JSON.stringify(error)
          )
      );
  }

  // Methos to get device accurate  using device GPS
  async getLocationCoordinates() {
    await this.geolocation.getCurrentPosition().then((resp) => {
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;
      this.conn.latitude = this.locationCoords.latitude;
      this.conn.longitude = this.locationCoords.longitude;
    });
  }
}
