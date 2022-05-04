import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlacesResponse, Feature } from '../interfaces/places';
import { PlacesApiClient } from '../api/placesAPIClient';
import { MapService } from './map.service';
import { LngLatBounds } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation!:[number,number ];
  public isLoadingPlaces:boolean = false;
  public places: Feature[]=[];

  get isUserLocationReady():Boolean{
    return !!this.userLocation;
  }

  constructor(private placesApi:PlacesApiClient,
    private mapService:MapService

    ) {
    this.getUserLocation();

  }

  async getUserLocation():Promise<[number,number]>{
    return new Promise( ( res, rej) => {
      navigator.geolocation.getCurrentPosition(
        ({coords}) => {
          this.userLocation=[coords.longitude,coords.latitude];
          res(this.userLocation);

        },
        (err) => {
          console.log(err);
          alert('We could not get your geolocation');
          rej();

        }

      );
    });
  }


  getPlacesByQuery(query:string=''){
    this.isLoadingPlaces=true;
    //TODO: EMpty string
    if (query.length === 0 ){
      this.isLoadingPlaces=false;
        this.places=[];
      return;
    }
    if (!this.userLocation) throw Error('No user location');
     this.placesApi.get<PlacesResponse>(`/${query}.json`,{
       params: {
        proximity:this.userLocation.join(',')
       }
     })
     .subscribe(resp =>{
        console.log(resp.features);
        this.isLoadingPlaces=false;
        this.places=resp.features;

        this.mapService.createMarkersFromPlaces(this.places,this.userLocation);

     });

  }


}
