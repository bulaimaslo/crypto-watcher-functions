import Moralis from 'moralis';
import { CreateERC20TransferStreamData } from './types';

export const createERC20TransferStream = async (data: CreateERC20TransferStreamData) => {
    const ERC20_transfer_ABI = [{
        "anonymous": false,
        "inputs": [
            { "indexed": true, "name": "from", "type": "address" },
            { "indexed": true, "name": "to", "type": "address" },
            { "indexed": false, "name": "value", "type": "uint256" },
        ],
        "name": "Transfer",
        "type": "event",
    }];

    const response = await Moralis.Streams.add({
        webhookUrl: data.webhookUrl,
        description: data.description,
        tag: data.tag,
        chains: data.chainIds,
        abi: ERC20_transfer_ABI,
        topic0: ["Transfer(address,address,uint256)"],
        allAddresses: true,
        includeContractLogs: true,
    });

    return response.toJSON();
};

export const deleteStream = async (streamId: string) => {
    const response = await Moralis.Streams.delete({
        id: streamId,
    });
    return response.toJSON();
};
