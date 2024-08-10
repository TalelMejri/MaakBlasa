import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AddTrajetComponenetComponent } from './add-trajet-componenet/add-trajet-componenet.component';
import { ListTrajetComponentComponent } from './list-trajet-component/list-trajet-component.component';
import { FaqComponentComponent } from './faq-component/faq-component.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'AddTrajet', component: AddTrajetComponenetComponent },
  { path: "ListTrajet", component: ListTrajetComponentComponent },
  { path: "faq", component: FaqComponentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
