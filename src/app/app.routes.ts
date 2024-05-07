import { Routes } from '@angular/router';
import { RegisterComponent } from './components/users/register/register.component';
import { LoginComponent } from './components/users/login/login.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { loginGuard } from './guards/login.guard';
import { NewEventComponent } from './components/events/new-event/new-event.component';
import { EventComponent } from './components/events/event/event.component';
import { NewImageComponent } from './components/events/new-image/new-image.component';
import { userRolGuard } from './guards/user-rol.guard';

export const routes: Routes = [
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: 'gallery', pathMatch: 'full'},
    {path: 'gallery', component: GalleryComponent, canActivate: [loginGuard]}, 
    {path: 'new-event', component: NewEventComponent, canActivate: [loginGuard, userRolGuard]},
    {path: 'event/:eventId', component: EventComponent, canActivate: [loginGuard]},
    {path: 'event/:eventId/new-image', component: NewImageComponent}
];
