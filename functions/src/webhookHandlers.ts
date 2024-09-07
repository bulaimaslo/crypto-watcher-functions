import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Transaction, Erc20TransferEvent } from './types';

const db = admin.firestore();

export const onWebhookReceived = functions.https.onRequest(async (req, res) => {
  const webhookData = req.body;
  // Assuming the tag is in the format 'userId_streamType'
  const userId = webhookData.tag.split('_')[0]; 

  if (webhookData.confirmed) {
    if (webhookData.erc20Transfers) {
      await storeErc20Transfers(userId, webhookData.erc20Transfers);
    }
    if (webhookData.txs) {
      await storeTransactions(userId, webhookData.txs);
    }
  }

  res.status(200).send('Webhook received');
});

async function storeErc20Transfers(userId: string, transfers: Erc20TransferEvent[]) {
  const batch = db.batch();
  transfers.forEach((transfer) => {
    const docRef = db.collection(`users/${userId}/erc20Transfers`).doc();
    batch.set(docRef, {
      ...transfer,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
  await batch.commit();
}

async function storeTransactions(userId: string, transactions: Transaction[]) {
  const batch = db.batch();
  transactions.forEach((transaction) => {
    const docRef = db.collection(`users/${userId}/transactions`).doc();
    batch.set(docRef, {
      ...transaction,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
  await batch.commit();
}
export const fetchRecentEvents = async (data: { userId: string; limit: number }) => {
    const { userId, limit } = data;
    const eventType = 'erc20Transfers';
    const snapshot = await db.collection(`users/${userId}/${eventType}`)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};