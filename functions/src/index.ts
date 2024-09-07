import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { ipRateLimiterMiddleware } from './rateLimiter';
import { onTransactionWrite, onErc20TransferWrite } from './webhookHandlers';
import { getBlock, getBlockTimestamp } from './apiProxies';

admin.initializeApp();

const firestore = admin.firestore();
const ipRateLimiter = ipRateLimiterMiddleware(firestore);

// Webhook handlers
export { onTransactionWrite, onErc20TransferWrite };

// API proxies with rate limiting
export const getBlockProxy = functions.https.onCall(ipRateLimiter(getBlock));
export const getBlockTimestampProxy = functions.https.onCall(ipRateLimiter(getBlockTimestamp));
