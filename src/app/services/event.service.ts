import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';
import { Event } from '../definitions/event';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private baseUrl: string;
    event: Event;


    constructor(private http: HttpClient) {
        this.baseUrl = 'http://localhost:3000/api/events';
    }

    getEvent(eventId: string): Observable<Event>{
        return this.http.get<any>(`${this.baseUrl}/${eventId}`).pipe(
            map((response) => {
                return{
                    id: response._id,
                    name: response.name,
                    description: response.description,
                    themes: response.themes, 
                    startDate: new Date(response.startDate),
                    endDate: new Date(response.endDate),
                    randomImage: null
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
                    randomImage: null
                }));
            })
        );
    }

    getEventImages(eventId: string): Observable<any[]>{
        return this.http.get<any[]>(`${this.baseUrl}/${eventId}/images`).pipe(response => {
            return response;
        })
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

}
