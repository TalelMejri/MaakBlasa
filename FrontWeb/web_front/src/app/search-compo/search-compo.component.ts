import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { tab } from '../constant/variable';
import { isDateInRange } from '../constant/functions';
@Component({
  selector: 'app-search-compo',
  templateUrl: './search-compo.component.html',
  styleUrl: './search-compo.component.css'
})
export class SearchCompoComponent {

  constructor(private MatSnackBar: MatSnackBar, private router: Router) {
    this.tab=tab;
  }

  destination: { governorate: string, delegation: string } = {
    governorate: '',
    delegation: ''
  };

  tab:any;

  depart: { governorate: string, delegation: string } = {
    governorate: '',
    delegation: ''
  };


  choseDestination(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.destination.delegation = target.value;
    const selectedGovernorate = tab.find((gov: any) => gov.Delegations.some((del: any) => del.Name === target.value));
    if (selectedGovernorate) {
      this.destination.governorate = selectedGovernorate.Name;
    }
  }

  choseDepart(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.depart.delegation = target.value;
    const selectedGovernorate = tab.find((gov: any) => gov.Delegations.some((del: any) => del.Name === target.value));
    if (selectedGovernorate) {
      this.depart.governorate = selectedGovernorate.Name;
    }
  }

  date_chose = null;
  Nbr: number = 0;


  SearchForTrajet() {
    if (this.depart.delegation == '' || this.destination.delegation == '' || this.date_chose == null || this.Nbr == 0) {
      this.MatSnackBar.open("ناقصتك حاجة عمر كل شيء عاد", 'باهي', {
        duration: 2000,
      })
      return;
    }

    if(this.depart.delegation == this.destination.delegation){
      this.MatSnackBar.open("الرجاء اختيار وجهة مختلفة عن نقطة الانطلاق", 'باهي', {
        duration: 2000,
      });
      return;
    }

    if (!isDateInRange(this.date_chose)) {
      this.MatSnackBar.open("الرجاء اختيار تاريخ بين اليوم ثلاثة أيام من الآن", 'باهي', {
        duration: 2000,
      });
      return;
    }

    const formData = {
      depart: {
        governorate: this.depart.governorate,
        delegation: this.depart.delegation
      },
      destination: {
        governorate: this.destination.governorate,
        delegation: this.destination.delegation
      },
      date_chose: this.date_chose,
      Nbr: this.Nbr
    };
    localStorage.setItem('trajetData', JSON.stringify(formData));
    this.router.navigate(['/ListTrajet']);

  }



}
