import * as Parse from 'parse';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

Parse.initialize('dracattus');
(Parse as any).serverURL = environment.serverURL;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor() { }

  public async getDracattusFAQ(){
    const res = await Parse.Cloud.run('exampleApiCall');
    console.log('API Response: ',res);
    return res;
  }
}
