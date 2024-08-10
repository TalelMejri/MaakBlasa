import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { tab } from '../constant/variable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { TrajetServiceService } from '../services/trajet-service.service';
import Echo from 'laravel-echo';
import { isPlatformBrowser } from '@angular/common';
import { log } from 'console';

@Component({
  selector: 'app-add-trajet-componenet',
  templateUrl: './add-trajet-componenet.component.html',
  styleUrl: './add-trajet-componenet.component.css'
})

export class AddTrajetComponenetComponent implements OnInit {

  name: any = "";
  tlf: any = "";
  profilefacebook: any = "";
  isAuth: any = false;
  trajet: any = [];
  user: any = [];

  constructor(@Inject(PLATFORM_ID) private platformId: any, private TrajetServiceService: TrajetServiceService, private MatSnackBar: MatSnackBar, private router: Router, private fb: FormBuilder, private AuthserviceService: AuthserviceService) {
    this.tab = tab;
    this.searchForm = this.fb.group({
      depart: ['', Validators.required],
      destination: ['', Validators.required],
      date:['', [Validators.required, this.dateRangeValidator]],
      time: ['', Validators.required],
      seats: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
      animals: [''],
      smoking: [''],
      charging: [''],
      airConditioning: ['']
    });
  }


  getUser() {
    if (localStorage.getItem('token') == null) {
      return;
    }
    this.AuthserviceService.getProfile().subscribe((res: any) => {
      this.isAuth = true;
      if (res[0].trajet.length > 0) {
        this.trajet = res[0].trajet;
        this.user = res[0];
      }
      this.getRequestForTrajer();
      this.getRequestAccepted();
    }, (err: any) => {
      this.isAuth = false;
    })
  }

  Requests: any = [];
  getRequestForTrajer() {
    this.Requests = [];
    this.TrajetServiceService.getTrajets().subscribe((res: any) => {
      if (res[0]?.requests.length > 0) {
        this.Requests = res[0].requests;
      }
    })
  }

  AccptedRequest: boolean = true;

  RequestAccpted: any = [];

  getRequestAccepted() {
    this.TrajetServiceService.getTrajetAccepted().subscribe((res: any) => {
      if (res[0]?.requests.length > 0) {
        this.RequestAccpted = res[0].requests;
      }
    })
  }

  AcceptedUser(id: any,nbplaces:any) {
    this.TrajetServiceService.AccepterUser({
      user_id: id,
      trajet_id: this.trajet[0].id,
      nbplaces:nbplaces
    }).subscribe((res: any) => {
      this.MatSnackBar.open("تم قبول الطلب", 'باهي', {
        duration: 2000,
      });

      this.Requests = [];
      this.RequestAccpted = [];
      this.getRequestForTrajer();
      this.getRequestAccepted();
      this.getUser();
      this.AccptedRequest = true;
    })
  }

  RejectUser(id: any) {
    this.TrajetServiceService.RejectUser({
      user_id: id,
      trajet_id: this.trajet[0].id
    }).subscribe((res: any) => {
      this.MatSnackBar.open("تم رفض الطلب", 'باهي', {
        duration: 2000,
      });
      this.RequestAccpted = [];
      this.getRequestForTrajer();
      this.getRequestAccepted();
      this.getUser();
    })
  }

  get percentage(): number {
    return (this.trajet[0].nbplacesCurrent / this.trajet[0].nbplaces) * 100;
  }

  logoUrl = '../../assets/images/logo_app.png';
  welcomeMessage = 'شوف شكون في ثنيتك ';
  subtitle = 'وإربح دعوة خير';
  drpTunisiaUrl = '../../assets/images/pexels-lina-12238399.jpg';
  searchForm: FormGroup;

  destination: { governorate: string, delegation: string } = {
    governorate: '',
    delegation: ''
  };

  tab: any;

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

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const echo = new Echo({
        broadcaster: 'pusher',
        key: 'local',
        cluster: 'mtl',
        wsHost: window.location.hostname,
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        wsPath: '',
      });

      echo.channel('public').listen('NotifEvent', (res: any) => {
        this.getUser();
      });
    }
    this.getUser();

  }


  dateRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const date = control.value;
    if (!date) return null;

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 3);

    today.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date < today || date > maxDate) {
      return { 'dateRange': true };
    }
    return null;
  }

  onSubmit() {
    if (this.trajet.length > 0) {
      this.MatSnackBar.open("لازم يكمل وقت طريق إلي عندك توا", 'باهي', {
        duration: 2000,
      });
    } else {
      if (this.searchForm.valid) {
        const formData = this.searchForm.value;
        if (this.depart.delegation == this.destination.delegation) {
          this.MatSnackBar.open("الرجاء اختيار وجهة مختلفة عن نقطة الانطلاق", 'باهي', {
            duration: 2000,
          });
          return;
        }
        var options = [];
        if (this.searchForm.value['animals'] == '1') {
          options.push({ "name": "حيوانات" });
        }
        if (this.searchForm.value['smoking'] == '1') {
          options.push({ "name": "يتكيف" });
        }
        if (this.searchForm.value['charging'] == '1') {
          options.push({ "name": "إيشرجي" });
        }
        if (this.searchForm.value['airConditioning'] == '1') {
          options.push({ "name": "كليماتيزور" });
        }
        this.searchForm.value['date'].setDate(this.searchForm.value['date'].getDate() + 1);
        const formattedDate = this.searchForm.value['date'].toISOString().split('T')[0];
        this.TrajetServiceService.AddTrajet({
          depart: this.depart.governorate + " " + this.depart.delegation,
          arrivee: this.destination.governorate + " " + this.destination.delegation,
          date: formattedDate,
          heure: this.searchForm.value['time'],
          nbplaces: this.searchForm.value['seats'],
          options: JSON.stringify(options)
        }).subscribe((res: any) => {
          this.MatSnackBar.open("سايي طريقك موجود عنا ", 'باهي', {
            duration: 2000,
          });
          this.router.navigate(['/']);
        }, (error: any) => {
          this.MatSnackBar.open("لازم يكمل وقت طريق إلي عندك توا", 'باهي', {
            duration: 2000,
          });
        })
      } else {
        this.searchForm.markAllAsTouched();
      }
    }
  }

  DeleteTrajet(id: number) {
    this.TrajetServiceService.DeleteTrajet(id).subscribe((res: any) => {
      this.MatSnackBar.open("تم حذف الطريق بنجاح", 'باهي', {
        duration: 2000,
      });
      this.getUser();
      location.reload();
    }, (err: any) => {
      this.MatSnackBar.open("حدث خطأ ما", 'باهي', {
        duration: 2000,
      });
    })
  }

  RegisterUser() {
    this.AuthserviceService.Register({
      name: this.name,
      phone: this.tlf,
      LinkFacebook: this.profilefacebook ? this.profilefacebook : null,
      role: 'driver'
    }).subscribe((res: any) => {
      localStorage.setItem("token", res['token']);
      this.MatSnackBar.open("تم التسجيل بنجاح", 'باهي', {
        duration: 2000,
      });
      this.getUser();

    }, (err: any) => {
      this.MatSnackBar.open("حدث خطأ ما", 'باهي', {
        duration: 2000,
      });
    })
  }

}


