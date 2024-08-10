import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tab } from '../constant/variable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isDateInRange } from '../constant/functions';
import { TrajetServiceService } from '../services/trajet-service.service';
import { AuthserviceService } from '../services/authservice.service';
import Echo from 'laravel-echo';

@Component({
  selector: 'app-list-trajet-component',
  templateUrl: './list-trajet-component.component.html',
  styleUrl: './list-trajet-component.component.css'
})

export class ListTrajetComponentComponent implements OnInit {


  constructor(private MatSnackBar: MatSnackBar, private AuthserviceService: AuthserviceService, private router: Router, private TrajetServiceService: TrajetServiceService) {
    this.tab = tab;
  }

  isAuth: any = false;
  vipSeatChecked: boolean = false;
  smokingChecked: boolean = false;
  chargingChecked: boolean = false;
  petFriendlyChecked: boolean = false;

  destination: { governorate: string, delegation: string } = {
    governorate: '',
    delegation: ''
  };

  depart: { governorate: string, delegation: string } = {
    governorate: '',
    delegation: ''
  };

  RequestsIdStatus: any = [];
  trajets: any = [];
  progressData: number[] = [];
  date_chose = new Date();
  Nbr: number = 0;
  val: any;
  tab: any;
  name: any = "";
  tlf: any = "";
  profilefacebook: any = "";
  date_selected: string = "";

  SupprimerDeamnde(id: any) {
    this.TrajetServiceService.SupprimerDeamnde(id).subscribe((res) => {
      this.getRequestTrajetes();
      this.init();
      this.getRequestTrajetes();
    })
  }

  getRequestTrajetes() {
    this.RequestsIdStatus = [];
    this.TrajetServiceService.getRequest().subscribe((res: any) => {
      res.data.forEach((element: any) => {
        this.RequestsIdStatus.push({ id: element.trajet_id, status: element.status });
      })
    })
  }

  getRequestStatus(trajetId: number): any {
    const request = this.RequestsIdStatus.findIndex((val: any) => val.id === trajetId);
    return request;
  }

  calculateProgress() {
    this.trajets.forEach((trajet: any, index: any) => {
      const progress = (trajet.nbplacesCurrent / trajet.nbplaces) * 100;
      this.progressData[index] = progress;
    });
  }

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

  ngOnInit(): void {
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
      this.init();
      this.getRequestTrajetes();
    });

    this.init();
    if (localStorage.getItem('token') != null) {
      this.getRequestTrajetes();
    }
  }

  init() {
    this.getData();
    this.getTrajets();
    this.getUser();
  }

  getTrajets() {
    this.date_chose.setDate(this.date_chose.getDate() + 1);
    const formattedDate = this.date_chose.toISOString().split('T')[0];
    const timeRange = this.getTimeRange(this.date_selected);

    const options = {
      vipSeat: this.vipSeatChecked,
      smoking: this.smokingChecked,
      charging: this.chargingChecked,
      petFriendly: this.petFriendlyChecked,
    };

    this.TrajetServiceService.FilterTrajet({
      depart: this.depart.governorate,
      arrive: this.destination.governorate,
      date: formattedDate,
      nbr: this.Nbr,
      timeRange: timeRange,
      options: JSON.stringify(options)
    }).subscribe((res: any) => {
      this.trajets = res;
      this.calculateProgress();
    })
  }

  refreshAllFilter() {
    this.vipSeatChecked = false;
    this.smokingChecked = false;
    this.chargingChecked = false;
    this.petFriendlyChecked = false;
    this.date_selected = "";
    this.init();
  }

  getTimeRange(dateSelected: string): string {
    switch (dateSelected) {
      case 'before_6':
        return '00:00:00-06:00:00';
      case '6_to_12':
        return '06:00:00-12:00:00';
      case '12_to_18':
        return '12:00:00-18:00:00';
      case 'after_18':
        return '19:00:00-23:59:00';
      default:
        return '';
    }
  }

  refresh() {
    localStorage.removeItem("trajetData");
    this.router.navigate(['/']);
  }

  getData() {
    const trajetData = localStorage.getItem('trajetData');
    this.val = trajetData ? JSON.parse(trajetData) : [];
    this.destination.governorate = this.val.destination.governorate;
    this.destination.delegation = this.val.destination.delegation;
    this.depart.governorate = this.val.depart.governorate;
    this.depart.delegation = this.val.depart.delegation;
    this.date_chose = new Date(this.val.date_chose);
    this.Nbr = this.val.Nbr;
  }

  SearchForTrajet() {
    if (this.depart.delegation == '' || this.destination.delegation == '' || this.date_chose == null || this.Nbr == 0) {
      this.MatSnackBar.open("ناقصتك حاجة عمر كل شيء عاد", 'باهي', {
        duration: 2000,
      })
      return;
    }

    if (this.depart.delegation == this.destination.delegation) {
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

    if (this.Nbr > 5) {
      this.MatSnackBar.open("الرجاء اختيار عدد الركاب بين 1 و 4", 'باهي', {
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
    this.init();
  }

  getUser() {
    if (localStorage.getItem('token') == null) {
      return;
    }
    this.AuthserviceService.getProfile().subscribe((res: any) => {
      this.isAuth = true;
      this.user = res[0];
    }, (err: any) => {
      this.isAuth = false;
    })
  }

  ReserverTrajet(trajet_id: any) {
    this.TrajetServiceService.ReserverTrajet({
      trajet_id: trajet_id,
      nbplaces: this.Nbr
    }).subscribe((res) => {
      this.MatSnackBar.open("تم التسجيل بنجاح", 'باهي', {
        duration: 2000,
      });
    }, (err) => {
      this.MatSnackBar.open("وصلت بلاصتك كان قبلك تو نعلموك ", 'باهي', {
        duration: 2000,
      });
    })
  }

  CreateAlert() {
    this.TrajetServiceService.CreateAlert({
      depart: this.depart.governorate,
      destination: this.destination.governorate,
      date: this.date_chose.toISOString().split('T')[0]
    }).subscribe((res) => {
      this.MatSnackBar.open("تم التسجيل بنجاح", 'باهي', {
        duration: 2000,
      });
    }, (error) => {
      this.MatSnackBar.open("موجودة سايي", 'باهي', {
        duration: 2000,
      });
    })
  }

  RegisterUser() {
    this.AuthserviceService.Register({
      name: this.name,
      phone: this.tlf,
      LinkFacebook: this.profilefacebook ? this.profilefacebook : null,
      role: 'passager',
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

  user: any = [];
  logoUrl = '../../assets/images/logo.png';
  welcomeMessage = 'شوف مع شكون تركب';
  subtitle = 'وسع بالك';
  drpTunisiaUrl = '../../assets/images/tunisia_palestine.jpg';

}
