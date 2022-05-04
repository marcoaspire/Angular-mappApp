import { Injectable } from '@angular/core';
import { LngLat, LngLatLike, Map, Marker, Popup, LngLatBounds, AnySourceData } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api/directionsAPIClient';
import { DirectionsResponse, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?:Map;
  private markers:Marker[]=[];
  get isMapReady(){
    return !!this.map;
  }

  constructor(private directionsApi:DirectionsApiClient){}

  setMap(map:Map){
    this.map=map;
  }

  flyTo(coords: LngLatLike){
    if (!this.isMapReady) throw Error('Map is not ready');
    this.map?.flyTo({
      zoom:14,
      center: coords
    });

  }

  createMarkersFromPlaces(places:Feature[], userLocation: [number,number] )
  {
    if ( !this.map) throw Error('Map does not inizialized');
    const newMarkers=[];

    this.markers.forEach(m => m.remove());

    for (const place of places) {
      const [lng,lat] = place.center;
      const popup = new Popup().setHTML(
        `
          <h6>${place.text}</h6>
          <span>${place.place_name}</span>
        `
        );
        const newMarker = new Marker()
        .setLngLat([lng,lat])
        .setPopup(popup)
      .addTo(this.map);

      newMarkers.push(newMarker);



    }

    this.markers = newMarkers;
    if (this.markers.length === 0 )return ;
    const bounds = new LngLatBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);

    this.map.fitBounds(bounds,{
      padding:200
    });
  }

  getRouteBetweenPoints(start: [number,number],end: [number,number] ){
    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')} ; ${end.join(',')}`)
    .subscribe( resp =>{
      console.log(resp);
      this.drawPolyline(resp.routes[0]);
    });
  }

  private drawPolyline (route:Route)
  {
    console.log({kms: route.distance/1000, duration: route.duration/60});

    if (!this.map) throw Error('Map is not initialized');

    const coords= route.geometry.coordinates;
    const bounds = new LngLatBounds();

    coords.forEach( ([lng,lat]) => {
      bounds.extend([lng,lat])
    });

    this.map!.fitBounds(bounds,{
      padding:200
    });


    // Polyline
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }

    //remove last route
    if ( this.map.getLayer('RouteString') ) {
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }


    this.map.addSource('RouteString', sourceData );

    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join':'round'
      },
      paint: {
        'line-color': 'black',
        'line-width': 3
      }
    });


  }

}
