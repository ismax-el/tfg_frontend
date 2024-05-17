import { Routes } from '@angular/router';
import { RegisterComponent } from './components/users/register/register.component';
import { LoginComponent } from './components/users/login/login.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { loginGuard } from './guards/login.guard';
import { NewEventComponent } from './components/events/new-event/new-event.component';
import { EventComponent } from './components/events/event/event.component';
import { NewImageComponent } from './components/events/new-image/new-image.component';
import { userRolGuard } from './guards/user-rol.guard';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { importProvidersFrom } from '@angular/core';
import { eventStatusGuard } from './guards/event-status.guard';
import { EditEventComponent } from './components/events/edit-event/edit-event.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {path: 'register', component: RegisterComponent, providers: [importProvidersFrom(
        RecaptchaV3Module
    ),
    {provide: RECAPTCHA_V3_SITE_KEY, useValue: '6Ld7ytcpAAAAAHezT_WixVa_BzgnregVX-HAFKnq'}]},
    {path: 'login', component: LoginComponent, providers: [importProvidersFrom(
        RecaptchaV3Module
    ),
    {provide: RECAPTCHA_V3_SITE_KEY, useValue: '6Ld7ytcpAAAAAHezT_WixVa_BzgnregVX-HAFKnq'}]},
    {path: '', redirectTo: 'gallery', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'gallery', component: GalleryComponent, canActivate: [loginGuard]}, 
    {path: 'new-event', component: NewEventComponent, canActivate: [loginGuard, userRolGuard]},
    {path: 'event/:eventId/edit-event', component: EditEventComponent, canActivate: [loginGuard, userRolGuard, eventStatusGuard]},
    {path: 'event/:eventId', component: EventComponent, canActivate: [loginGuard]},
    {path: 'event/:eventId/new-image', component: NewImageComponent, canActivate: [loginGuard, eventStatusGuard]},
    {path: '**', component: NotFoundComponent}
];
