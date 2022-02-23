import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../shared/components/interfaces";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  subscription!: Subscription;

  constructor(private auth: AuthService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    })
  }

  submit() {
    if(this.form.invalid) {
      return
    }

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.subscription = this.auth.login(user).subscribe( () => {
      this.form.reset();
      this.router.navigate(['/admin', 'dashboard']);
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
