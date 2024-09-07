import Moralis from 'moralis';
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { GetBlockData, GetBlockTimestampData } from './types';


export const getBlock = async (data: GetBlockData) => {
    const response = await Moralis.EvmApi.block.getBlock({
        chain: data.chain,
        blockNumberOrHash: data.blockNumberOrHash,
    });
    return response ? response.toJSON() : null;
};

export const getBlockTimestamp = async (data: GetBlockTimestampData) => {
    const response = await Moralis.EvmApi.block.getBlock({
        chain: EvmChain.ETHEREUM,
        blockNumberOrHash: data.blockNumberOrHash,
    });
    return response ? response.toJSON() : null;
};