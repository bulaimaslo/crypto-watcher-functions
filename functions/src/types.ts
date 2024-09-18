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

export interface GetWalletPnLSummaryData {
  address: string;
  chain: string;
  days?: string;
}

export interface GetWalletPnLBreakdownData {
  address: string;
  chain: string;
  days?: string;
  token_addresses?: string[];
}

export interface GetTopProfitableWalletsByTokenData {
  address: string;
  chain: string;
  days?: string;
}

