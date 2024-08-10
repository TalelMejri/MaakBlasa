
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent  {

  constructor() {
  }

  ngOnInit(): void {

  }

  logoUrl = '../../assets/images/logo.png';
  welcomeMessage = 'مرحبا بيك في "معاك بلاصة " 👋';
  subtitle = 'أخلط على بلاصتك فيسع';
  drpTunisiaUrl = '../../assets/images/pexels-lina-12238399.jpg';

}
