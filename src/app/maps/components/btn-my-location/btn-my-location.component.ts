import { Component } from '@angular/core';
import { MapService } from '../../services/map.service';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent {

  constructor(private mapService:MapService, private placesService:PlacesService) { }

  myLocation(){
    if (!this.placesService.isUserLocationReady) throw Error('User does not have a location');
    if (!this.mapService.isMapReady) throw Error('There is not a available map');

    this.mapService.flyTo(this.placesService.userLocation!);
  }

}
