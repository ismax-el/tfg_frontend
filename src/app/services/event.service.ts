import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, firstValueFrom, map, throwError } from 'rxjs';
import { Event } from '../definitions/event';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private baseUrl: string;
    event: Event;


    constructor(private userService: UserService,private http: HttpClient) {
        this.baseUrl = 'https://kaiprojectbackend.onrender.com/api/events';
    }

    getEvent(eventId: string): Observable<Event>{
        return this.http.get<any>(`${this.baseUrl}/${eventId}`).pipe(
            map((response) => {
                if(!response || response.error){
                    throw new Error('Evento no encontrado')
                }
                return{
                    id: response._id,
                    name: response.name,
                    description: response.description,
                    themes: response.themes, 
                    startDate: new Date(response.startDate),
                    endDate: new Date(response.endDate),
                    defaultImage: null,
                    isActive: null
                }
            })
        )
    }

    getEvents(): Observable<Event[]>{
        return this.http.get<any[]>(this.baseUrl).pipe(
            map((response: any[]) => {
                return response.map(event => ({
                    id: event._id,
                    name: event.name,
                    description: event.description,
                    themes: event.themes,
                    startDate: new Date(event.startDate),
                    endDate: new Date(event.endDate),
                    defaultImage: null,
                    isActive: null
                }));
            })
        );
    }

    getEventImages(eventId: string): Observable<any[]>{
        return this.http.get<any[]>(`${this.baseUrl}/${eventId}/images`).pipe(
            map((response: any[]) => {
                response.sort((a, b) => b.likes - a.likes)
                return response;
            }),
            catchError((error) => {
                return throwError(error)
            })
        )
    }

    uploadEventImage(formData: FormData){
        console.log(formData)
        return firstValueFrom(
            this.http.post<any>(`${this.baseUrl}/${formData.get('event_id')}/images/upload`, formData)
        )
    }

    createEvent(formValue: any){
        return firstValueFrom(
            this.http.post<any>(`${this.baseUrl}/create`, formValue)
        )
    }

    updateEvent(eventId: string, formValue: any){
        return firstValueFrom(
            this.http.put<any>(`${this.baseUrl}/${eventId}/editEvent`, formValue)
        )
    }

    deleteEvent(eventId: string){
        return this.http.delete<any>(`${this.baseUrl}/${eventId}/delete`).pipe(response => {
            return response;
        });
    }

}
