import * as admin from 'firebase-admin';
admin.initializeApp();

import Moralis from 'moralis';
import { ipRateLimiterMiddleware } from './rateLimiter';
import { onWebhookReceived, fetchRecentEvents } from './webhookHandlers';
import { createERC20TransferStream, deleteStream } from './streamManagement';
import {
  getWalletPnLSummary,
  getWalletPnLBreakdown,
  getTopProfitableWalletsByToken
} from './apiProxies';
import * as functions from 'firebase-functions';


const moralisApiKey = functions.config().moralis.api_key;
Moralis.start({ apiKey: moralisApiKey });

const firestore = admin.firestore();
const ipRateLimiter = ipRateLimiterMiddleware(firestore);

// Webhook handler
export const webhookHandler = onWebhookReceived;

// Stream management
export const createStreamProxy = functions.https.onCall(ipRateLimiter(createERC20TransferStream));
export const deleteStreamProxy = functions.https.onCall(ipRateLimiter(deleteStream));

// Event fetching
export const fetchRecentEventsProxy = functions.https.onCall(ipRateLimiter(fetchRecentEvents));

// API proxies with rate limiting and Moralis initialization
export const getWalletPnLSummaryProxy = functions.https.onCall(ipRateLimiter(getWalletPnLSummary));
export const getWalletPnLBreakdownProxy = functions.https.onCall(ipRateLimiter(getWalletPnLBreakdown));
export const getTopProfitableWalletsByTokenProxy = functions.https.onCall(ipRateLimiter(getTopProfitableWalletsByToken));