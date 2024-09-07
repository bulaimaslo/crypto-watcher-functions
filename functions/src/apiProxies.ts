import Moralis from 'moralis';
import * as types from './types';


export const getWalletPnLSummary = async (data: types.GetWalletPnLSummaryData) => {
      const response = await Moralis.EvmApi.wallets.getWalletProfitabilitySummary({
        chain: data.chain,
        address: data.address,
        days: data.days || 'all',
      });
      return response ? response.toJSON() : null;
  };
  
  export const getWalletPnLBreakdown = async (data: types.GetWalletPnLBreakdownData) => {
      const response = await Moralis.EvmApi.wallets.getWalletProfitability({
        chain: data.chain,
        address: data.address,
        days: data.days || 'all',
        tokenAddresses: data.token_addresses,
      });
      return response ? response.toJSON() : null;
  };

  export const getTopProfitableWalletsByToken = async (data: types.GetTopProfitableWalletsByTokenData) => {
      const response = await Moralis.EvmApi.token.getTopProfitableWalletPerToken({
        chain: data.chain,
        address: data.address,
        days: data.days || 'all',
      });
      return response ? response.toJSON() : null;
  };