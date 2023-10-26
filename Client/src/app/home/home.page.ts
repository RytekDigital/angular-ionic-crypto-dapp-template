import { Component } from '@angular/core';
import { Web3Service } from '../services/walletconnect.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  connected = false;

  constructor(
    private web3Service:Web3Service,
    private apiService:ApiService
  ) {}

  async ngOnInit(){
    const res = await this.apiService.getDracattusFAQ()
  }

  async connectWallet(){
    this.web3Service.connectWallet();
    this.connected = true;
  }

}
