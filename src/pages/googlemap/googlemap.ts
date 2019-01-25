import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  // StreetViewPanorama,
  // StreetViewLocation,
  // StreetViewCameraPosition,
  // CameraPosition,
  // MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
/**
 * Generated class for the GooglemapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-googlemap',
  templateUrl: 'googlemap.html',
})
export class GooglemapPage {
  map: GoogleMap;
  // panorama: StreetViewPanorama;
  marker: Marker;
  title: any;
  longitude: any;
  latitude: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.latitude = this.navParams.get('lattitude');
    this.longitude = this.navParams.get('longitude');
    this.title = this.navParams.get('title');
    this.loadMap();
   // alert(this.latitude+'/'+this.longitude);
  }

  loadMap() {
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.latitude,
          lng: this.longitude
        },
        zoom: 18,
        tilt: 30
      }
    };
    this.map = GoogleMaps.create('map_canvas', mapOptions);
   // alert('map created');
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        //alert('marker created');
        this.map.addMarker({
          title: this.title,
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: this.latitude,
            lng: this.longitude
          }
        })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
              // alert('clicked');
            });
          });

      }).catch(e => alert(JSON.stringify(e)));
  }
}
