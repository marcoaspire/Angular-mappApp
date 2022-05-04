import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  //private debounceTimer ?= NodeJS.Timeout;

  constructor(private placesService:PlacesService) { }

  onQueryChanged(query:string = ''){
    console.log(query );
     setTimeout(()=>{
       this.placesService.getPlacesByQuery(query);
     },1000);
  }
}
