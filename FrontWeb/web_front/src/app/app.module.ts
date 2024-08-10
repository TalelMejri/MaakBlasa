import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { provideNativeDateAdapter } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CommentsComponent } from './comments/comments.component';
import { HomePageComponent } from './home-page/home-page.component';
import { InfoComponentComponent } from './info-component/info-component.component';
import { SearchCompoComponent } from './search-compo/search-compo.component';
import { SectionDrapeauComponentComponent } from './section-drapeau-component/section-drapeau-component.component';
import "./locale-ar-dz";
import { AddTrajetComponenetComponent } from './add-trajet-componenet/add-trajet-componenet.component';
import { ListTrajetComponentComponent } from './list-trajet-component/list-trajet-component.component'
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptotService } from './InterceptorGlobal/interceptot.service';
import { TimeAgoPipe } from './time-ago.pipe';
import { FaqComponentComponent } from './faq-component/faq-component.component';
import { SectionHomeComponent } from './section-home/section-home.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    CommentsComponent,
    HomePageComponent,
    InfoComponentComponent,
    SearchCompoComponent,
    SectionDrapeauComponentComponent,
    AddTrajetComponenetComponent,
    ListTrajetComponentComponent,
    TimeAgoPipe,
    FaqComponentComponent,
    SectionHomeComponent,
  ],
  exports: [
    SectionDrapeauComponentComponent
  ],
  imports: [
    BrowserModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'ar-DZ' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptotService,
      multi: true
    },
 
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
