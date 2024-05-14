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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import  {MatMenuModule} from '@angular/material/menu'

@Component({
    selector: 'app-gallery',
    standalone: true,
    imports: [MatMenuModule, DatePipe, MatExpansionModule, MatTooltipModule, MatDividerModule, MatIconModule, MatButtonModule, MatCardModule, RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
    allEvents: Event[] = [];
    pastEvents: Event[] = [];
    upComingEvents: Event[] = [];
    eventIds: string[] = [];

    constructor( private snackBar: MatSnackBar, private dialog: MatDialog, public userService: UserService, private eventService: EventService, private imageService: ImageService,private router: Router) { }

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
                this.getMostLikedEventImage(this.eventIds);
                console.log(this.eventIds);
                console.log(this.allEvents);


                //Separar en 2 arrays diferentes los actuales y los pasados
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                console.log("current", currentDate)
                this.pastEvents = this.allEvents.filter(event => event.endDate < currentDate);
                this.upComingEvents = this.allEvents.filter(event => event.endDate >= currentDate);
                
                //Actualizar el estado de los eventos dependiendo de donde se han colocado por fecha
                this.allEvents.forEach(event => {
                    if (this.pastEvents.some(pastEvent => pastEvent.id === event.id)) {
                        event.isActive = false;
                    } else {
                        event.isActive = true;
                    }
                });

                //llamada al image service, pasarle array de urls con id de evento y que vaya haciendo llamada a llamada, lista/objeto clave valor --> eventoId: array imagenesIds
                this.imageService.getImages(this.eventIds);
            });
    }
    

    getMostLikedEventImage(eventIds: string[]){
        eventIds.forEach(eventId => {
            this.eventService.getEventImages(eventId).subscribe(images =>{
                //Si el evento tiene imágenes, cogemos la primera
                if(images.length > 0){
                    //Ordenamos en orden descendente las imágenes por like y cogemos la primera
                    images.sort((a, b) => b.likes - a.likes);
                    this.allEvents.find(event => event.id == eventId)!.randomImage = images[0]._id;
                }
            })
        })
    }

    goToEvent(eventId: string){
        //Seteamos en el event service el evento clickado para poder acceder desde el componente evento a él
        this.eventService.event = this.allEvents.find(event => event.id == eventId)!
        this.router.navigate(['/event', eventId]);
    }

    editEvent(eventId: string){
        this.router.navigate([`/event/${eventId}/edit-event`])
    }

    openDialog(eventId: string, isDeleteDialog: boolean) {
        console.log(isDeleteDialog)
        const dialogRef = this.dialog.open(DialogComponent, {
            data: isDeleteDialog
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
            if(result && isDeleteDialog){
                this.deleteEvent(eventId)
            }
        });
    }

    askDeleteEvent(eventId: string, isDeleteDialog: boolean){
        this.openDialog(eventId, isDeleteDialog);
    }

    deleteEvent(eventId: string){
        //Implementar el dialog avisando que se borrarán todas las ilustraciones
        this.eventService.deleteEvent(eventId).subscribe(response => {
            if(!response.error){
                this.getAllEvents();
                this.snackBar.open(response.success, 'Cerrar', { duration: 3000 });
            }else{
                this.snackBar.open('Algo ha salido mal, inténtalo más tarde.', 'Cerrar', { duration: 3000 });
            }
        })
        console.log("Borramos", eventId)
    }
}
