import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-drapeau-component',
  templateUrl: './section-drapeau-component.component.html',
  styleUrl: './section-drapeau-component.component.css'
})
export class SectionDrapeauComponentComponent {
  @Input() logoUrl: string="";
  @Input() welcomeMessage: string="";
  @Input() subtitle: string="";
  @Input() drpTunisiaUrl: string="";
}
