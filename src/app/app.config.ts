import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { MAT_DATE_LOCALE } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes, withInMemoryScrolling({
        scrollPositionRestoration: 'top',
    })), provideAnimationsAsync(), provideHttpClient(withInterceptors([authInterceptor])),
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'}

    ]
};
