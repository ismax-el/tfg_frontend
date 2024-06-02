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
import { UserService } from '../../../services/user.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-event',
    standalone: true,
    imports: [MatProgressSpinner, MatTooltipModule, AsyncPipe, DatePipe, MatCardModule, MatButtonModule, MatIconModule],
    templateUrl: './event.component.html',
    styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit {
    eventId: string;
    images: any[] = [];
    baseUrl: string;
    event: Event | null;
    likedImage: string | null;
    winnersInfo: any[] = [];
    isLoading: boolean = true;

    @ViewChild('likedImage') likedImageElement: ElementRef | undefined;

    constructor(public userService: UserService, private snackBar: MatSnackBar, private dialog: MatDialog, private activatedRoute: ActivatedRoute, private eventService: EventService, private imageService: ImageService, private router: Router) {
        this.baseUrl = 'https://kaiprojectbackend.onrender.com/api/events';
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
            this.eventService.getEvent(this.eventId).subscribe((event) => {
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                event.isActive = event.endDate < currentDate ? false : true;
                this.eventService.getEventImages(this.eventId).subscribe(images => {
                    if (images.length > 0) {
                        //Ordenamos en orden descendente las imágenes por like y cogemos la primera
                        images.sort((a, b) => b.likes - a.likes);
                        event.defaultImage = images[0]._id;
                    }
                },
                error => {
                    console.error("Error al obtener las imágenes.")
                    this.router.navigate(['/not-found'])
                })

                this.event = event;
            },
            (error) => {
                console.error("Error al obtener el evento.")
                this.router.navigate(['/not-found'])
            })
        }


        //Inicializamos las imágenes del evento en el que nos encontramos
        if (this.imageService.eventImagesDict[this.eventId]) {
            console.log("Existe i")
            this.images = this.imageService.eventImagesDict[this.eventId]
            if (!this.event?.isActive && this.images.length > 0) {
                //Sacamos los likes de la imagen con más likes y miramos si hay más que tengan esa cantidad de likes
                let maxLikes = this.images[0].likes;
                let tiedImages = this.images.filter(eventImage => eventImage.likes == maxLikes);

                this.getWinnersInfo(tiedImages);


            }
        } else {
            console.log("No existe i")
            this.eventService.getEventImages(this.eventId).subscribe(images => {
                this.images = images;
                if (!this.event?.isActive && this.images.length > 0) {
                    //Sacamos los likes de la imagen con más likes y miramos si hay más que tengan esa cantidad de likes
                    let maxLikes = this.images[0].likes;
                    let tiedImages = this.images.filter(eventImage => eventImage.likes == maxLikes);

                    this.getWinnersInfo(tiedImages);
                }
            },
            error => {
                console.error("Error al obtener el evento.")
                this.router.navigate(['/not-found'])
            })
        }

        //Obtener en caso, de que haya, la imagen con like del user de ese evento
        this.imageService.getUserEventLike(this.eventId).subscribe((response) => {
            console.log(response);

            if(!response.error)
                this.likedImage = response.imageId;
        })


        console.log("Evento actual: ", this.event);

        setTimeout(() => {
            this.isLoading = false;
        }, 1000);
    }

    getWinnersInfo(winnerImages: any[]) {
        winnerImages.forEach(winnerImage => {
            this.userService.getUserInfo(winnerImage.user_id).subscribe(userInfo => {
                userInfo.winningImage = winnerImage._id;
                this.winnersInfo.push(userInfo);
                console.log(userInfo);
            })
        })
    }

    goToUploadImage() {
        console.log("HOLA", this.eventId)
        this.router.navigate([`/event/${this.eventId}/new-image`])
    }

    openImageDialog(imageId: string) {
        const imageUrl = `${this.baseUrl}/${this.eventId}/images/${imageId}/original`
        this.dialog.open(ImageComponent, {
            data: { imageUrl }
        })
    }

    likeImage(imageId: string) {
        this.imageService.likeImage(this.eventId, imageId).subscribe(
            (response) => {
                if (response.alreadyLiked) {
                    this.openDialog(imageId, false);
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

    openDialog(imageId: string, isDeleteDialog: boolean) {
        console.log(isDeleteDialog, imageId)
        const dialogRef = this.dialog.open(DialogComponent, {
            data: isDeleteDialog
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
            if (result && !isDeleteDialog) {
                this.dislikeImage(imageId);
            } else if (result && isDeleteDialog) {
                this.deleteImage(imageId)
            }
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

    askDeleteImage(imageId: string) {
        this.openDialog(imageId, true)
    }

    deleteImage(imageId: string) {
        this.imageService.deleteImage(this.eventId, imageId).subscribe(response => {
            if (!response.error) {
                //mostrar la típica snackbar
                this.snackBar.open(response.success, 'Cerrar', { duration: 3000 });

                //actualizar las imágenes
                this.eventService.getEventImages(this.eventId).subscribe(images => {
                    this.images = images;
                })
            }
        })
    }

}
