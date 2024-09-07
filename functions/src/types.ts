export interface Transaction {
  fromAddress: string;
  toAddress: string;
  value: string;
  confirmed: boolean;
  // and more...
}
  
export interface Erc20TransferEvent {
  from: string;
  to: string;
  value: string;
  confirmed: boolean;
  // and more...
}

export interface GetBlockTimestampData {
  blockNumberOrHash: string;
}

export interface GetBlockData {
  chain: string;
  blockNumberOrHash: string;
}