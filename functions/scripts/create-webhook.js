const axios = require('axios');
const util = require('ethereumjs-util');

function generateSignature(data, apiKey) {
  const raw = JSON.stringify(data) + apiKey;
  const buffer = Buffer.from(raw, 'utf-8');
  return util.bufferToHex(util.keccak256(buffer));
}

async function createWebhook(url, data, apiKey) {
  const signature = generateSignature(data, apiKey);

  await axios.post(url, data, {
    headers: {
      'x-signature': signature,
    },
  });
}

async function main() {
  const webhookUrl = process.argv[2];
  const apiKey = process.argv[3];

  if (!webhookUrl || !apiKey) {
    console.log('Usage: create-webhook.js <WEBHOOK_URL> <API_KEY>');
    return;
  }

  await createWebhook(webhookUrl, './sample_webhook.json', apiKey);
}

main();
