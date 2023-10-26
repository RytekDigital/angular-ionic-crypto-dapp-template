import { Injectable } from '@angular/core';
import { ethers, Wallet, Contract } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private provider: ethers.JsonRpcProvider;
  private signer: Wallet | null = null;
  connected = false;

  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://rpc.pulsechain.com');
  }

  async connectWallet() {
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    this.signer = new Wallet(account, this.provider);
    this.connected = true;
    console.log(account);
  }

  getContract(contractAddress: string, contractAbi: any) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    return new Contract(contractAddress, contractAbi, this.signer);
  }
}
