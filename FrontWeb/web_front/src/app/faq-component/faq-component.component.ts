import { Component } from '@angular/core';

@Component({
  selector: 'app-faq-component',
  templateUrl: './faq-component.component.html',
  styleUrl: './faq-component.component.css'
})
export class FaqComponentComponent {
  logoUrl = '../../assets/images/logo.png';
  welcomeMessage = 'أسئلة / أجوبة';
  subtitle = ' أسئلة و أجوبة على الموقع';
  drpTunisiaUrl = '../../assets/images/Question-mark.jpg';
}
