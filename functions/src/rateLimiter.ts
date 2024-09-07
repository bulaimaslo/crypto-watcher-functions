/* eslint-disable etc/no-t */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { FirebaseFunctionsRateLimiter } from "firebase-functions-rate-limiter";
import { CallableContext } from "firebase-functions/v1/https";

export type OnCallHandler<T> = (
  data: T,
  context: CallableContext
) => Promise<unknown>;

export class IpRateLimiter {
  public constructor(private readonly limiter: FirebaseFunctionsRateLimiter) {}

  public readonly wrap = <T>(handler: OnCallHandler<T>) => {
    return async (data: T, context: CallableContext) => {
      // eslint-disable-next-line prefer-template
      const qualifier = "ip-" + this.readNormalizedIp(context.rawRequest);

      await this.limiter.rejectOnQuotaExceededOrRecordUsage(qualifier);

      return handler(data, context);
    };
  };

  private readNormalizedIp(request: functions.https.Request): string {
    return request.ip ? request.ip.replace(/\.|:/g, "-") : "unknown";
  }
}

export function ipRateLimiterMiddleware(firestore: admin.firestore.Firestore) {
  const limiter = FirebaseFunctionsRateLimiter.withFirestoreBackend(
    {
      name: "rateLimiter",
      maxCalls: 10,
      periodSeconds: 5,
    },
    firestore
  );
  return new IpRateLimiter(limiter).wrap;
}