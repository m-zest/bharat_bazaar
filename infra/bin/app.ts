#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BharatBazaarDataStack } from '../lib/data-stack';
import { BharatBazaarAppStack } from '../lib/app-stack';
import { BharatBazaarFrontendStack } from '../lib/frontend-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'ap-south-1', // Mumbai
};

// Stack 1: DynamoDB table (stateful — survives redeployments)
const dataStack = new BharatBazaarDataStack(app, 'BharatBazaarDataStack', { env });

// Stack 2: Lambda + API Gateway (stateless — safe to redeploy)
const appStack = new BharatBazaarAppStack(app, 'BharatBazaarAppStack', {
  env,
  table: dataStack.table,
});
appStack.addDependency(dataStack);

// Stack 3: S3 + CloudFront (frontend hosting)
const frontendStack = new BharatBazaarFrontendStack(app, 'BharatBazaarFrontendStack', {
  env,
  api: appStack.api,
});
frontendStack.addDependency(appStack);

app.synth();
