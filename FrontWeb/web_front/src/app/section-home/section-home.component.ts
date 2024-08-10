import { Component } from '@angular/core';

@Component({
  selector: 'app-section-home',
  templateUrl: './section-home.component.html',
  styleUrl: './section-home.component.css'
})
export class SectionHomeComponent {
  scrollToNextSection() {
    const nextSection = document.getElementById('next_section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
