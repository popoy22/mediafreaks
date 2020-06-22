import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { EmployeeService } from "../../services/employee.service";
import { LoadingController } from "@ionic/angular";

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private eService: EmployeeService,
    private router: Router,
    public loadingController: LoadingController
  ) {}

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Please wait...",
    });
    await loading.present();
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }
  onSubmit() {
    this.presentLoading();
    this.eService.login(this.loginForm.value).subscribe(
      (data: any) => {
        if (data.access_token) {
          if (data.user.admin == 0) {
            this.messageToast("You dont have priviledge to access the system");
          } else {
            localStorage.setItem("access_token", data.access_token);
            setTimeout(() => {
              this.router.navigate(["employees"]);
            }, 1000);
          }
        } else {
          this.messageToast(data.message);
        }
        this.loadingController.dismiss();
      },
      (error) => {
        this.loadingController.dismiss();
      }
    );
  }
  async messageToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: "top",
      color: "danger",
    });
    toast.present();
  }
}
