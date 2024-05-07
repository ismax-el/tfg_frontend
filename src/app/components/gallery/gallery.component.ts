import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatExpansionModule } from '@angular/material/expansion'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../definitions/event';
import { catchError, firstValueFrom } from 'rxjs';
import { ImageService } from '../../services/image.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-gallery',
    standalone: true,
    imports: [DatePipe, MatExpansionModule, MatTooltipModule, MatDividerModule, MatIconModule, MatButtonModule, MatCardModule, RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
    allEvents: Event[] = [];
    pastEvents: Event[] = [];
    upComingEvents: Event[] = [];
    eventIds: string[] = [];

    constructor(public userService: UserService, private eventService: EventService, private imageService: ImageService,private router: Router) { }

    ngOnInit(): void {
        this.getAllEvents();
    }

    getAllEvents() {
        this.eventService.getEvents()
            .pipe(catchError(error => {
                console.error('Error fetching events:', error);
                return []; // Retornar un array vacío en caso de error
            }))
            .subscribe(events => {
                //Traer todos los eventos y crear lista de ids
                this.allEvents = events;
                this.allEvents.forEach(event => {
                    this.eventIds.push(event.id);
                });
                
                //Obtener imágenes para los eventos de muestra
                this.getRandomEventImage(this.eventIds);
                console.log(this.eventIds);
                console.log(this.allEvents);


                //Separar en 2 arrays diferentes los actuales y los pasados
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

                this.pastEvents = this.allEvents.filter(event => event.endDate < currentDate);
                this.upComingEvents = this.allEvents.filter(event => event.endDate >= currentDate);
                
                //llamada al image service, pasarle array de urls con id de evento y que vaya haciendo llamada a llamada, lista/objeto clave valor --> eventoId: array imagenesIds
                this.imageService.getImages(this.eventIds);

                //Coger una imagen aleatoria de cada evento para usar de portada
                //Gestionar segun fecha un array de eventos ya acabados
            });
    }
    

    getRandomEventImage(eventIds: string[]){
        eventIds.forEach(eventId => {
            this.eventService.getEventImages(eventId).subscribe(images =>{
                if(images.length > 0)
                    this.allEvents.find(event => event.id == eventId)!.randomImage = images[0]._id;
            })
        })
    }

    goToEvent(eventId: string){
        //Seteamos en el event service el evento clickado para poder acceder desde el componente evento a él
        this.eventService.event = this.allEvents.find(event => event.id == eventId)!
        this.router.navigate(['/event', eventId]);
    }

    deleteEvent(eventId: string){
        console.log("Borramos", eventId)
    }
}
