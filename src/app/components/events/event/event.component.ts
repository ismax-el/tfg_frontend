import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { catchError, firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { ImageService } from '../../../services/image.service';
import { Event } from '../../../definitions/event';
import { DatePipe, AsyncPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog'
import { ImageComponent } from '../../image/image.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../../dialog/dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-event',
    standalone: true,
    imports: [MatTooltipModule, AsyncPipe, DatePipe, MatCardModule, MatButtonModule, MatIconModule],
    templateUrl: './event.component.html',
    styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit {
    eventId: string;
    images: any[] = [];
    baseUrl: string;
    event: Event | null;
    likedImage: string | null;

    @ViewChild('likedImage') likedImageElement: ElementRef | undefined;

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private activatedRoute: ActivatedRoute, private eventService: EventService, private imageService: ImageService, private router: Router) {
        this.baseUrl = 'http://localhost:3000/api/events';
        this.eventId = this.activatedRoute.snapshot.paramMap.get('eventId')!;
        console.log(this.eventId);
    }

    ngOnInit(): void {
        //Gestionar si el evento ya ha finalizado, mostrar X cosa en la vista y no dejar participar más
        //obviamente no poder acceder a la url de new-image si ya ha pasado el evento

        //Inicializamos el evento en el que nos encontramos
        if (this.eventService.event) {
            console.log("Existe e")
            this.event = this.eventService.event;
        } else {
            console.log("No existe e")
            this.eventService.getEvent(this.eventId).subscribe(event => {
                this.event = event;
            })
        }

        //Inicializamos las imágenes del evento en el que nos encontramos
        if (this.imageService.eventImagesDict[this.eventId]) {
            console.log("Existe i")
            this.images = this.imageService.eventImagesDict[this.eventId]
        } else {
            console.log("No existe i")
            this.eventService.getEventImages(this.eventId).subscribe(images => {
                this.images = images;
            })
        }

        //Obtener en caso, de que haya, la imagen con like del user de ese evento
        this.imageService.getUserEventLike(this.eventId).subscribe((response) => {
            console.log(response);
            this.likedImage = response.imageId;
        })

    }

    goToUploadImage() {
        this.router.navigate([`/event/${this.eventId}/new-image`])
    }

    openImageDialog(imageId: string) {
        const imageUrl = `${this.baseUrl}/${this.eventId}/images/${imageId}/original`
        this.dialog.open(ImageComponent, {
            width: "500px",
            data: { imageUrl }
        })
    }

    likeImage(imageId: string) {
        this.imageService.likeImage(this.eventId, imageId).subscribe(
            (response) => {
                if (response.alreadyLiked) {
                    this.openDialog(imageId);
                }
                else if (!response.error) {
                    this.snackBar.open('¡Has dado like a esta imagen!', 'Cerrar', { duration: 3000 });
                    console.log(response);
                    this.likedImage = response.image_id;
                } else {
                    this.snackBar.open(response.error, 'Cerrar', { duration: 3000 })
                }
            }
        );
    }

    dislikeImage(imageId: string) {
        this.imageService.dislikeImage(this.eventId, imageId).subscribe(
            (response) => {
                if (response.success) {
                    this.likedImage = null;
                    console.log(response);
                }
            }
        )
    }

    openDialog(imageId: string) {
        const dialogRef = this.dialog.open(DialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
            if (result)
                this.dislikeImage(imageId);
        });
    }

    scrollToLikedImage() {
        if (this.likedImageElement) {
            this.likedImageElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            this.likedImageElement.nativeElement.classList.add('highlighted-image');

            // Después de unos segundos, remover la clase de resaltado temporal
        setTimeout(() => {
            if (this.likedImageElement) {
                this.likedImageElement.nativeElement.classList.remove('highlighted-image');
            }
        }, 3000);
        }
    }

}
