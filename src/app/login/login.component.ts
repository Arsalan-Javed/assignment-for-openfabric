import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { storage_keys } from '../services/serviceUrls';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

    constructor(
      private ApiService: AppService,
      private toaster: ToastrService,
      private formBuilder: FormBuilder,
      public router: Router
    ) { 

      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
      });

    }

  

  ngOnInit(): void {
  }

  login() {

    if (this.loginForm.invalid) {
      return;
    }

    var credentials  = this.loginForm.getRawValue();
   

    this.ApiService.login(credentials).subscribe(
      (response:any) => {
          if(response.token){
            localStorage.setItem(storage_keys.TOKEN,response.token);
            this.router.navigate(['products']);
          }
          else{
            this.toaster.error("Invalid Username or Password");
          }
      },
      (error) => {
        this.toaster.error("Invalid Username or Password");
      }
    );
  }


}
