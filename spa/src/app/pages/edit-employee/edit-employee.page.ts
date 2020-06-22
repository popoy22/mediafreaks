import { Component, OnInit } from "@angular/core";
import { EmployeeService } from "../../services/employee.service";
import { ToastController } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { NavController } from "@ionic/angular";

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
@Component({
  selector: "app-edit-employee",
  templateUrl: "./edit-employee.page.html",
  styleUrls: ["./edit-employee.page.scss"],
})
export class EditEmployeePage implements OnInit {
  registerForm: FormGroup;
  passwordForm: FormGroup;
  id: any;
  employee: any;
  segment: any = "detail";
  constructor(
    private eService: EmployeeService,
    private fb: FormBuilder,
    private toastController: ToastController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private router: Router,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.loadEmployee();
  }

  loadEmployee() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.eService.employee(this.id).subscribe((data: any) => {
      this.employee = data.employee;

      this.loadForm();
      this.loadPassword();
    });
  }

  loadForm() {
    this.registerForm = this.fb.group({
      firstname: [
        this.employee.firstname,
        [Validators.required, Validators.maxLength(30)],
      ],
      lastname: [
        this.employee.lastname,
        [Validators.required, Validators.maxLength(30)],
      ],
      gender: [this.employee.gender, [Validators.required]],
      birthdate: [this.employee.birthdate, [Validators.required]],
      phone: [
        this.employee.phone,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(8),
          Validators.pattern("^[0-9]*$"),
        ],
      ],
      email: [this.employee.email, [Validators.required, Validators.email]],
      address: [this.employee.address, [Validators.required]],
      admin: [this.employee.admin.toString(), [Validators.required]],
    });
  }

  loadPassword() {
    this.passwordForm = this.fb.group({
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern("^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$"),
        ],
      ],
      confirm_password: ["", [Validators.required]],
    });
  }

  get p() {
    return this.passwordForm.controls;
  }
  get f() {
    return this.registerForm.controls;
  }
  onSubmit() {
    console.log(this.registerForm.value);
    this.eService
      .update(this.id, this.registerForm.value)
      .subscribe((data: any) => {
        if (data.message) {
          this.messageToast(data.message, "danger");
        } else {
          this.eService.employeeEmitter.emit("Change Detail");
          this.messageToast("Saved.", "dark");
        }
      });
  }

  changePassword() {
    this.eService
      .update(this.id, this.passwordForm.value)
      .subscribe((data: any) => {
        this.messageToast("Password Changed.", "dark");
        this.loadEmployee();
      });
  }

  deleteEmployee() {
    this.eService.delete(this.id).subscribe((data) => {
      //this.router.navigate(["/employees"]);
      this.eService.employeeEmitter.emit("Deleted");
      this.navController.navigateBack("/employees");
    });
  }

  async messageToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: "top",
      color: color,
    });
    toast.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Confirm!",
      message: "Message: Are you sure you want to delete this employee?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Okay",
          handler: () => {
            this.deleteEmployee();
          },
        },
      ],
    });

    await alert.present();
  }
}
