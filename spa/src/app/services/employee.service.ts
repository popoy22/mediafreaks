import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  employeeEmitter = new EventEmitter();

  loadHeader() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      }),
    };
  }

  login(obj) {
    return this.http.post(
      environment.api_url + "/authenticate",
      obj,
      this.loadHeader()
    );
  }

  employees() {
    return this.http.get(environment.api_url + "/employees", this.loadHeader());
  }

  employee(id) {
    return this.http.get(
      environment.api_url + "/employees/" + id,
      this.loadHeader()
    );
  }

  add(obj) {
    return this.http.post(
      environment.api_url + "/employees",
      obj,
      this.loadHeader()
    );
  }

  update(id, obj) {
    return this.http.put(
      environment.api_url + "/employees/" + id,
      obj,
      this.loadHeader()
    );
  }

  delete(id) {
    return this.http.delete(
      environment.api_url + "/employees/" + id,
      this.loadHeader()
    );
  }
}
