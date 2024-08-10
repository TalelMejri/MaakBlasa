import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Aos from 'aos';
import Echo from 'laravel-echo';
import { TrajetServiceService } from './services/trajet-service.service';
import { AuthserviceService } from './services/authservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'web_front';
  isAuth: boolean = false;

  constructor(private MatSnackBar: MatSnackBar, private AuthserviceService: AuthserviceService, private trajetService: TrajetServiceService) { }
  user: any;

  getUser() {
    if (localStorage.getItem('token') == null) {
      return;
    }
    this.AuthserviceService.getProfile().subscribe((res: any) => {
      this.isAuth = true;
      this.user = res[0];
      if (this.user.welcome == '0') {
        let test = new SpeechSynthesisUtterance("welcome " + this.user.name);
        speechSynthesis.speak(test);
        setTimeout(() => {
          this.AuthserviceService.UdpateWelcome().subscribe((res) => {
            this.getUser();
          })
        }, 1000)
      }
    }, (err: any) => {
      this.isAuth = false;
    })
  }

  DeleteAllNotif() {
    this.trajetService.DeleteAllNotif().subscribe((res: any) => {
      console.log(res);
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.getUser();
      this.isAuth = localStorage.getItem("token") ? true : false;

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

      if (this.isAuth) {
        this.trajetService.getLatstNotif().subscribe(
          (res: any) => {
            if (res.length == 0) return;
            this.MatSnackBar.open(res.content, 'باهي', {}).onAction().subscribe(() => {
              this.DeleteAllNotif();
            });
          }
        );

        echo.channel('public').listen('NotifEvent', (res: any) => {
          //console.log(res);
          if (res.tab.length > 0) {
            if (res.tab.find((val: any) => val.id == this.user.id)) {
              this.MatSnackBar.open(res.message, 'باهي', {}).onAction().subscribe(() => {
                this.DeleteAllNotif();
              });
            }
          } else {
            if (res.tab.id == this.user.id) {
              this.MatSnackBar.open(res.message, 'باهي', {}).onAction().subscribe(() => {
                this.DeleteAllNotif();
              });
            }
          }
        });
      }

      Aos.init();
      console.log(`
          Created by: Mejri Talel
          LinkedIn: https://www.linkedin.com/in/talel-mejri-899a73232/
          Facebook: https://www.facebook.com/talel.mejri.140/
          Github: https://github.com/TalelMejri
          CodeForces: https://codeforces.com/profile/Bizou
      `);
    }
  }

}
