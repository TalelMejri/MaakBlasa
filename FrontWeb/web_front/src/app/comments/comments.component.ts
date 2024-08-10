import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  constructor(private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGiscusScript();
    }
  }

  loadGiscusScript() {
    const script = this.renderer.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'TalelMejri/Covoiturage');
    script.setAttribute('data-repo-id', 'R_kgDOMK50gw');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '1');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDOMK50g84CgmFN');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', "light");
    script.setAttribute('data-lang', 'ar');
    script.setAttribute('data-loading', 'lazy');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    this.renderer.appendChild(document.getElementById('giscus-container'), script);
  }
}
