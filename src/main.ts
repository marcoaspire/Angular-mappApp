import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken = 'pk.eyJ1Ijoib2NyYW05NiIsImEiOiJja21jODM2enIxcHZ4MnZudXN0djl0dXd1In0.kqwXiQ4yjKnolxOQGQjTUQ';


if(!navigator.geolocation)
{
  alert('Does not support geolocation')
  throw new Error('Does not support geolocation');
}


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
