import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { getItem } from './dynamodb-client';
import { v4 as uuidv4 } from 'uuid';

const REGION = process.env.AWS_REGION || 'ap-south-1';
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL || 'noreply@bharatbazaar.ai';
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || '';
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL || '';

let sqsClient: SQSClient | null = null;
let snsClient: SNSClient | null = null;
let sesClient: SESClient | null = null;

function getSQS(): SQSClient {
  if (!sqsClient) sqsClient = new SQSClient({ region: REGION });
  return sqsClient;
}

function getSNS(): SNSClient {
  if (!snsClient) snsClient = new SNSClient({ region: REGION });
  return snsClient;
}

function getSES(): SESClient {
  if (!sesClient) sesClient = new SESClient({ region: REGION });
  return sesClient;
}

export type NotificationType =
  | 'USER_REGISTERED'
  | 'PRICING_ALERT'
  | 'SENTIMENT_ALERT'
  | 'CONTENT_READY'
  | 'WEEKLY_DIGEST';

export interface NotificationEvent {
  type: NotificationType;
  userId: string;
  email?: string;
  [key: string]: any;
}

export interface SQSNotificationMessage {
  messageId: string;
  enqueuedAt: string;
  version: '1';
  event: NotificationEvent;
}

/**
 * Send notification.
 * - Production (SQS_QUEUE_URL set): enqueues to SQS for async processing with retry.
 * - Local dev (no SQS_QUEUE_URL): sends directly via SES/SNS, fails silently.
 * Non-blocking — always call with .catch(() => {})
 */
export async function sendNotification(event: NotificationEvent): Promise<void> {
  // Production path: enqueue to SQS
  if (SQS_QUEUE_URL) {
    const message: SQSNotificationMessage = {
      messageId: uuidv4(),
      enqueuedAt: new Date().toISOString(),
      version: '1',
      event,
    };

    await getSQS().send(new SendMessageCommand({
      QueueUrl: SQS_QUEUE_URL,
      MessageBody: JSON.stringify(message),
      MessageAttributes: {
        notificationType: {
          DataType: 'String',
          StringValue: event.type,
        },
        userId: {
          DataType: 'String',
          StringValue: event.userId,
        },
      },
    }));

    console.log(`Notification enqueued: ${event.type} for user ${event.userId} [${message.messageId}]`);
    return;
  }

  // Local dev fallback: send directly
  try {
    let userEmail = event.email;
    let phoneNumber: string | undefined;
    let emailEnabled = true;
    let smsEnabled = false;

    const userProfile = await getItem(`USER#${event.userId}`, 'PROFILE');
    if (userProfile?.Data) {
      userEmail = userEmail || userProfile.Data.email;
      phoneNumber = userProfile.Data.phoneNumber;
      const prefs = userProfile.Data.preferences?.notifications;
      if (prefs) {
        emailEnabled = prefs.email !== false;
        smsEnabled = prefs.sms === true;
      }
    }

    if (emailEnabled && userEmail) {
      await sendEmail(event, userEmail).catch((err) =>
        console.warn(`Email notification failed for ${event.type}:`, err.message)
      );
    }

    if (smsEnabled && phoneNumber) {
      await sendSMS(event, phoneNumber).catch((err) =>
        console.warn(`SMS notification failed for ${event.type}:`, err.message)
      );
    }
  } catch (err: any) {
    console.warn(`Notification skipped for ${event.type}:`, err.message);
  }
}

// --- Email Templates (exported for notification-worker) ---

export function getEmailTemplate(event: NotificationEvent): { subject: string; body: string } | null {
  switch (event.type) {
    case 'USER_REGISTERED':
      return {
        subject: `Welcome to BharatBazaar AI!`,
        body: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #E65100;">Welcome to BharatBazaar AI</h2>
            <p>Hi${event.businessName ? ` from <strong>${event.businessName}</strong>` : ''},</p>
            <p>Your account is ready. Here's what you can do:</p>
            <ul>
              <li><strong>Smart Pricing</strong> — AI-powered pricing for your city</li>
              <li><strong>Content Generator</strong> — Product descriptions in 6 Indian languages</li>
              <li><strong>Sentiment Analyzer</strong> — Understand Hinglish customer reviews</li>
            </ul>
            <p style="margin-top: 20px;">
              <a href="${event.dashboardUrl || '#'}" style="background: #E65100; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                Open Dashboard
              </a>
            </p>
          </div>`,
      };

    case 'PRICING_ALERT':
      return {
        subject: `Pricing Recommendation: ${event.productName} (${event.confidence}% confident)`,
        body: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #E65100;">New Pricing Recommendation</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Product</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${event.productName}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Suggested Price</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 20px; color: #E65100;">₹${event.suggestedPrice}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Confidence</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${event.confidence}%</td></tr>
              <tr><td style="padding: 8px;"><strong>Revenue Impact</strong></td><td style="padding: 8px;">${event.expectedImpact}</td></tr>
            </table>
          </div>`,
      };

    case 'SENTIMENT_ALERT':
      return {
        subject: `Alert: ${event.productName} — Negative Sentiment Detected`,
        body: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D32F2F;">Sentiment Alert</h2>
            <p><strong>${event.productName}</strong> received negative feedback.</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Sentiment Score</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; color: #D32F2F;">${event.score}/100</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Top Complaint</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${event.topComplaint || 'N/A'}</td></tr>
              <tr><td style="padding: 8px;"><strong>Affected Reviews</strong></td><td style="padding: 8px;">${event.affectedReviews || 'N/A'}</td></tr>
            </table>
            <p style="margin-top: 16px;">Review the full analysis in your dashboard to take action.</p>
          </div>`,
      };

    case 'CONTENT_READY':
      return {
        subject: `Descriptions Ready: ${event.productName}`,
        body: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2E7D32;">Content Generated</h2>
            <p>Multilingual product descriptions for <strong>${event.productName}</strong> are ready.</p>
            <p><strong>Languages:</strong> ${event.languages}</p>
            <p>Copy-paste them to your Amazon, Flipkart, or other marketplace listings.</p>
          </div>`,
      };

    case 'WEEKLY_DIGEST':
      return {
        subject: `BharatBazaar AI — Your Weekly Summary`,
        body: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #E65100;">Weekly Summary</h2>
            <p>Here's what happened this week:</p>
            <ul>
              <li>Pricing analyses: ${event.pricingCount || 0}</li>
              <li>Content generated: ${event.contentCount || 0}</li>
              <li>Sentiment reports: ${event.sentimentCount || 0}</li>
            </ul>
            <p>Keep using BharatBazaar AI to stay ahead of your competitors.</p>
          </div>`,
      };

    default:
      return null;
  }
}

// --- Email send (exported for notification-worker) ---

export async function sendEmail(event: NotificationEvent, email: string): Promise<void> {
  const template = getEmailTemplate(event);
  if (!template) return;

  await getSES().send(new SendEmailCommand({
    Source: SES_FROM_EMAIL,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: template.subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: template.body, Charset: 'UTF-8' },
      },
    },
  }));

  console.log(`Email sent: ${event.type} → ${email}`);
}

// --- SMS (exported for notification-worker) ---

export function getSMSMessage(event: NotificationEvent): string | null {
  switch (event.type) {
    case 'PRICING_ALERT':
      return `BharatBazaar: ${event.productName} suggested at Rs${event.suggestedPrice} (${event.confidence}% confident). Check app.`;
    case 'SENTIMENT_ALERT':
      return `BharatBazaar: ${event.productName} has negative reviews. Check app for details.`;
    default:
      return null;
  }
}

export async function sendSMS(event: NotificationEvent, phoneNumber: string): Promise<void> {
  const message = getSMSMessage(event);
  if (!message) return;

  if (SNS_TOPIC_ARN) {
    await getSNS().send(new PublishCommand({
      TopicArn: SNS_TOPIC_ARN,
      Message: message,
    }));
  } else {
    await getSNS().send(new PublishCommand({
      PhoneNumber: phoneNumber,
      Message: message,
    }));
  }

  console.log(`SMS sent: ${event.type} → ${phoneNumber}`);
}
