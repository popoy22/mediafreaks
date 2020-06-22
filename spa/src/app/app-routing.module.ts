import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },

  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "employees",
    loadChildren: () =>
      import("./pages/employees/employees.module").then(
        (m) => m.EmployeesPageModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "edit-employee/:id",
    loadChildren: () =>
      import("./pages/edit-employee/edit-employee.module").then(
        (m) => m.EditEmployeePageModule
      ),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
