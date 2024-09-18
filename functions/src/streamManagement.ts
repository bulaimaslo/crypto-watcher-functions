import { EvmChain } from '@moralisweb3/common-evm-utils';
import Moralis from 'moralis';

export type EventType = 'Transfer' | 'Approval' | 'Burn' | 'Mint';

const webhookUrl = 'https://intimate-dassie-together.ngrok-free.app/cryptowatcher-bf63e/us-central1/ext-moralis-streams-webhook';

export interface createERC20TransferStreamInput {
  eventName: string;
  eventType: EventType;
  addressFrom?: string;
  addressTo?: string;
  value?: string;
  chains?: string[];
}

// eslint-disable-next-line complexity
export const createERC20TransferStream = async (data: createERC20TransferStreamInput) => {
  const {
    eventName = data.eventName,
    eventType = data.eventType,
    addressFrom = data.addressFrom,
    addressTo = data.addressTo,
    value = data.value,
    // chains = ['0x1'],
  } = data;

  let topicString = `${eventType}(address,address,uint256)`;
  if (eventType === 'Approval') {
    topicString = `${eventType}(address,address,uint256)`;
  } else if (eventType === 'Burn' || eventType === 'Mint') {
    topicString = `${eventType}(address,uint256)`;
  }

  const abi = [{
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "from", "type": "address" },
      { "indexed": true, "name": "to", "type": "address" },
      { "indexed": false, "name": "value", "type": "uint256" },
    ],
    "name": eventType,
    "type": "event",
  }];

  // Construct filter with only provided parameters
  const filterConditions: any[] = [];
  if (addressFrom) {
    filterConditions.push({ "eq": { "from": addressFrom } });
  }
  if (addressTo) {
    filterConditions.push({ "eq": { "to": addressTo } });
  }
  if (value) {
    filterConditions.push({ "gt": { "value": value } });
  }

  const filter_ERC20 = {
    "and": filterConditions.length > 0 ? filterConditions : undefined,
  };

  const options: any = {
    chains: [EvmChain.ETHEREUM],
    description: eventName,
    tag: eventName,
    abi,
    includeContractLogs: true,
    allAddresses: true,
    topic0: [topicString],
    advancedOptions: [
      {
        topic0: topicString,
        filter: filter_ERC20,
      }
    ],
    webhookUrl,
  };

  const response = await Moralis.Streams.add(options);
  return response
};

export const deleteStream = async (streamId: string) => {
  const response = await Moralis.Streams.delete({
    id: streamId,
  });
  return response.toJSON();
};


// curl -X POST https://intimate-dassie-together.ngrok-free.app/cryptowatcher-bf63e/us-central1/createStreamProxy -H "Content-Type: application/json" -d '{"data": { "eventName": "TokenTransfer", "eventType": "Transfer", "addressFrom": "0xE69022e830428F5A52f1D154e09A57A4eD2995fe", "addressTo": "0x28C6c06298d514Db089934071355E5743bf21d60", "value": "1000000000000000000" }}'