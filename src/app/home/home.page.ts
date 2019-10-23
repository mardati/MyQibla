import { Component } from '@angular/core';
import LatLon from 'geodesy/latlon-spherical.js';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  kaabaLocation = 0.0;
  bearingDegree = 0.0;
  printQiblaDegree: any = '';
  printMyLocation: any = '';
  printText: any = '';
  printLatLng: any;
  latitude = 0.0;
  longitude = 0.0;
  watch: any;
  trueHeading: any = '';

  constructor(private geolocation: Geolocation, public deviceOrientation: DeviceOrientation, platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready.
      // Here you can do any higher level native things you might need.
      this.locate();
    });
  }
  locate() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      let myLocation = new LatLon(this.latitude, this.longitude);
      this.printLatLng = myLocation;
      this.kaabaLocation = new LatLon(21.422499, 39.826194);
      this.bearingDegree = myLocation.initialBearingTo(this.kaabaLocation);

      this.startWatching();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  startWatching() {
    this.watch = this.deviceOrientation.watchHeading()
      .subscribe(
        (heading) => {
          this.trueHeading = heading.trueHeading;
          let compass = document.getElementsByClassName('compass') as HTMLCollectionOf<HTMLElement>;

          if (compass.length !== 0) {
            let compassDegree = 'rotate(' + (this.bearingDegree - 42) + 'deg) rotate(-' + this.trueHeading + 'deg)';
            compass[0].style.transform = compassDegree;
          }
        },
        (err) => {
          alert(JSON.stringify(err));
        }
      );
  }

  stopWatching() {
    if (this.watch != null) {
      this.watch.unsubscribe();
    }
  }

  printExtraInfo() {
    this.printText = 'احداثياتك';
    this.printMyLocation = this.printLatLng;
    this.printQiblaDegree = 'درجة ميلان القبلة عن الشمال: ' + this.bearingDegree.toFixed(0) + '';
  }

}
