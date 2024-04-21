import { Routes } from '@angular/router';
import { RegisterComponent } from './components/users/register/register.component';
import { LoginComponent } from './components/users/login/login.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { loginGuard } from './guards/login.guard';
import { NewEventComponent } from './components/events/new-event/new-event.component';

export const routes: Routes = [
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'gallery', component: GalleryComponent, canActivate: [loginGuard]}, 
    {path: 'new-event', component: NewEventComponent, canActivate: [loginGuard]} //A ESTA RUTA SOLO PODRÁ ACCEDER UN SUPERUSUARIO
];
