import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private userApi: string = 'https://testing.competitivecracker.com/api/v1/user/courses';

  private userApi: string = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  // getFullcourse(user: any) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });

  //   // Convert `user` object to query parameters
  //   let params = new HttpParams();
  //   Object.keys(user).forEach(key => {
  //     params = params.set(key, user[key]);
  //   });

  //   // Make the GET request with headers and query parameters
  //   return this.http.get(this.userApi, { headers, params });
  // }



  getRationalList(page: number, pageSize: number, groupId?: any, specialty?: any) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (groupId !== null && groupId !== undefined) {
      params = params.set('GroupID', groupId.toString());
    }
    if (specialty) { 
    params = params.set('SpecialtyCode', specialty); 
    }

    return this.http.get(`${this.userApi}/user/rationale`, { params });
  }
  
  getRationalData(id:any){
    return this.http.get(`${this.userApi}/user/rationale/${id}`);
  }

  getDecisionList(){
    return this.http.get(`${this.userApi}/user/decisions`);
  }

  getSpecialityList(){
    return this.http.get(`${this.userApi}/user/specialities`);
  }
  updateRationale(id:any,body:any){
    return this.http.put(`${this.userApi}/user/rationale/${id}`,body);
  }
    AddRationale(body:any){
    return this.http.post(`${this.userApi}/user/rationale`,body);
  }

}
