import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list'
import { MatIcon } from '@angular/material/icon';

export interface Tile {
    color: string;
    text: string;
    title: string;
  }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule, MatIcon],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
    tiles: Tile[] = [
        {title: 'Visualiza eventos que haya en marcha', text: 'Dispondrás de una variedad de eventos gestionados por nuestros administradores con todo tipo detemáticas. Desde paisajes, hasta retratos o incluso comidas.', color: 'lightblue'},
        {title: 'Espera a ver los resultados', text: '¡Ya solo nos queda esperar! Una vez finalizado el evento, podrás entrar y comprobar los ganadores.', color: 'lightgreen'},
        {title: 'Utiliza tu voto', text: 'Podrás votar la ilustración o diseño que más te guste según tu criterio y los temas que abarque el evento. Pero recuerda... ¡Solo dispondrás de un voto por evento!', color: 'lightpink'},
        {title: 'Participa en el evento que más te guste', text: 'No solo podrás votar, sino también participar. Siéntete libre de aportar tu granito de arena a los eventos y participar en ellos. Recuerda no subir diseños o ilustraciones que puedan discriminar o ser sensibles para cualquier público.', color: '#DDBDF1'},
      ];
}
