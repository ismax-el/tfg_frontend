import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    eventImagesDict: { [key: string]: string[] } = {};
    eventQueue: string[] = []; //Cola de eventos a cargar
    loadingEvent: string | null = null;

    private baseUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient, private userService: UserService) { }

    async loadImagesForEvent(eventId: string) {
        if (!this.loadingEvent) {
            this.loadingEvent = eventId;
            const eventImages = await firstValueFrom(this.http.get<any[]>(`http://localhost:3000/api/events/${eventId}/images`));
            eventImages.sort((a, b) => b.likes - a.likes);
            this.eventImagesDict[eventId] = eventImages;
            console.log("Se ha cargado el evento ", eventId, "con las imágenes: ", eventImages);
            this.loadingEvent = null;
            this.loadNextEvent(); // Cargar el próximo evento en la cola
        } else {
            // Si ya hay una carga en curso, agregamos este evento a la cola
            if (!this.eventQueue.includes(eventId)) {
                this.eventQueue.push(eventId);
            }
        }
    }

    loadNextEvent() {
        const nextEventId = this.eventQueue.shift(); // Obtener el próximo evento en la cola
        if (nextEventId) {
            this.loadImagesForEvent(nextEventId); // Cargar imágenes para el próximo evento
        }
    }

    async getImages(eventIds: string[]) {
        // Agregar todos los eventos a la cola de carga
        this.eventQueue.push(...eventIds);
        // Comenzar a cargar el primer evento si no hay ninguna carga en curso
        if (!this.loadingEvent) {
            this.loadNextEvent();
        }
    }

    getUserEventLike(eventId: string){
        const userId = this.userService.userId; // Obtener el userId del UserService
        if (!userId) {
            return throwError('Error: No se encontró el ID de usuario.');
        }
        return this.http.post<any>(`${this.baseUrl}/events/${eventId}/getLike`, {userId}).pipe(response => {
            return response;
        });
    }

    likeImage(eventId: string, imageId: string) {
        const userId = this.userService.userId; // Obtener el userId del UserService
        if (!userId) {
            return throwError('Error: No se encontró el ID de usuario.');
        }
        return this.http.post<any>(`${this.baseUrl}/events/${eventId}/images/${imageId}/like`, {userId}).pipe(response => {
            return response;
        });
    }

    dislikeImage(eventId: string, imageId: string){
        const userId = this.userService.userId; // Obtener el userId del UserService
        if (!userId) {
            return throwError('Error: No se encontró el ID de usuario.');
        }
        return this.http.post<any>(`${this.baseUrl}/events/${eventId}/images/${imageId}/dislike`, {userId}).pipe(response => {
            return response;
        });
    }

    deleteImage(eventId: string, imageId: string){
        return this.http.delete<any>(`${this.baseUrl}/events/${eventId}/images/${imageId}/delete`).pipe(response => {
            return response;
        });
    }
}
