// import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { ApplicationConfig } from '@angular/core';
// import { routes } from './app.routes';
// import { provideHttpClient, withFetch } from '@angular/common/http';
// import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation())
    // provideHttpClient(withFetch())
  ]
};
