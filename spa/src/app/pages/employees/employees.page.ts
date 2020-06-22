import { Component, OnInit } from "@angular/core";
import { EmployeeService } from "../../services/employee.service";
import { ToastController } from "@ionic/angular";
import { NavController } from "@ionic/angular";

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";

@Component({
  selector: "app-employees",
  templateUrl: "./employees.page.html",
  styleUrls: ["./employees.page.scss"],
})
export class EmployeesPage implements OnInit {
  employees: any;
  registerForm: FormGroup;
  segment: String = "list";
  constructor(
    private eService: EmployeeService,
    private fb: FormBuilder,
    private toastController: ToastController,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.eService.employeeEmitter.subscribe((data) => {
      this.loadEmployees();
    });
    this.loadForm();
    this.loadEmployees();
  }

  loadEmployees() {
    this.eService.employees().subscribe((data: any) => {
      this.employees = data.employees;
    });
  }

  loadForm() {
    this.registerForm = this.fb.group({
      firstname: ["", [Validators.required, Validators.maxLength(30)]],
      lastname: ["", [Validators.required, Validators.maxLength(30)]],
      gender: ["M", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern("^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$"),
        ],
      ],
      confirm_password: ["", [Validators.required]],
      birthdate: ["", [Validators.required]],
      phone: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(8),
          Validators.pattern("^[0-9]*$"),
        ],
      ],
      address: ["", [Validators.required]],
      admin: ["0", [Validators.required]],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.eService.add(this.registerForm.value).subscribe((data: any) => {
      if (data.created == false) {
        this.messageToast(
          this.registerForm.get("email").value + " is already in used",
          "danger"
        );
      } else {
        this.messageToast("Employee Added", "dark");
        this.registerForm.reset();
      }
      this.loadEmployees();
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

  logout() {
    localStorage.clear();
    this.navController.navigateBack("");
  }
}
