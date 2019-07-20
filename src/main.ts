import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// better UI with timeout on init for showing a better loading styles
setTimeout(() => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .then(res => {
      // after bootstrap remove the preloader from dom
      document.getElementById("Preloader").remove();
    })
    .catch(err => console.error(err));
}, 2000);// 2 seconds
