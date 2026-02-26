import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cloudwatchActions from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Construct } from 'constructs';
import * as path from 'path';

interface AppStackProps extends cdk.StackProps {
  table: dynamodb.ITable;
}

export class BharatBazaarAppStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const geminiApiKey = process.env.GEMINI_API_KEY
      || this.node.tryGetContext('geminiApiKey')
      || '';

    // --- Cognito User Pool ---

    const userPool = new cognito.UserPool(this, 'BharatBazaarUserPool', {
      userPoolName: 'BharatBazaarUsers',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: {
        email: { required: true, mutable: false },
        fullname: { required: false, mutable: true },
      },
      customAttributes: {
        businessName: new cognito.StringAttribute({ mutable: true }),
        city: new cognito.StringAttribute({ mutable: true }),
        businessCategory: new cognito.StringAttribute({ mutable: true }),
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // User Pool Client (for frontend SPA — no secret)
    const userPoolClient = new cognito.UserPoolClient(this, 'BharatBazaarClient', {
      userPool,
      userPoolClientName: 'BharatBazaarWebApp',
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      accessTokenValidity: cdk.Duration.hours(1),
      refreshTokenValidity: cdk.Duration.days(30),
      preventUserExistenceErrors: true,
    });

    // --- SNS Topic for notifications ---

    const notificationTopic = new sns.Topic(this, 'NotificationTopic', {
      topicName: 'BharatBazaar-Notifications',
      displayName: 'BharatBazaar Alerts',
    });

    // --- SQS Dead Letter Queue + Main Queue ---

    const notificationDLQ = new sqs.Queue(this, 'NotificationDLQ', {
      queueName: 'BharatBazaar-NotificationDLQ',
      retentionPeriod: cdk.Duration.days(14),
    });

    const notificationQueue = new sqs.Queue(this, 'NotificationQueue', {
      queueName: 'BharatBazaar-NotificationQueue',
      visibilityTimeout: cdk.Duration.seconds(90),
      retentionPeriod: cdk.Duration.days(4),
      deadLetterQueue: {
        queue: notificationDLQ,
        maxReceiveCount: 3,
      },
    });

    // Shared environment variables for all Lambda functions
    const commonEnv = {
      DYNAMODB_TABLE_NAME: props.table.tableName,
      GEMINI_API_KEY: geminiApiKey,
      GEMINI_MODEL_ID: 'gemini-2.0-flash',
      COGNITO_USER_POOL_ID: userPool.userPoolId,
      COGNITO_CLIENT_ID: userPoolClient.userPoolClientId,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps',
      SQS_QUEUE_URL: notificationQueue.queueUrl,
    };

    // Shared bundling config — local esbuild, exclude AWS SDK (already in Lambda runtime)
    const commonBundling: nodejs.BundlingOptions = {
      minify: true,
      sourceMap: true,
      forceDockerBundling: false,
      externalModules: [
        '@aws-sdk/client-dynamodb',
        '@aws-sdk/lib-dynamodb',
        '@aws-sdk/client-cognito-identity-provider',
        '@aws-sdk/client-sns',
        '@aws-sdk/client-ses',
        '@aws-sdk/client-sqs',
      ],
    };

    const handlersDir = path.join(__dirname, '../../backend/src/handlers');

    // --- Lambda Functions ---

    const pricingFn = new nodejs.NodejsFunction(this, 'PricingFunction', {
      functionName: 'BharatBazaar-Pricing',
      entry: path.join(handlersDir, 'pricing.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: commonEnv,
      bundling: commonBundling,
      description: 'Smart Pricing Engine — region-aware pricing strategies',
    });

    const descriptionsFn = new nodejs.NodejsFunction(this, 'DescriptionsFunction', {
      functionName: 'BharatBazaar-Descriptions',
      entry: path.join(handlersDir, 'descriptions.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 512,
      timeout: cdk.Duration.seconds(60),
      environment: commonEnv,
      bundling: commonBundling,
      description: 'Multilingual Description Generator — culturally adapted content',
    });

    const sentimentFn = new nodejs.NodejsFunction(this, 'SentimentFunction', {
      functionName: 'BharatBazaar-Sentiment',
      entry: path.join(handlersDir, 'sentiment.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: commonEnv,
      bundling: commonBundling,
      description: 'Sentiment Analyzer — Hinglish-aware review analysis',
    });

    const dashboardFn = new nodejs.NodejsFunction(this, 'DashboardFunction', {
      functionName: 'BharatBazaar-Dashboard',
      entry: path.join(handlersDir, 'dashboard.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      environment: {
        DYNAMODB_TABLE_NAME: props.table.tableName,
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      },
      bundling: commonBundling,
      description: 'Dashboard Aggregator — unified metrics view',
    });

    const authFn = new nodejs.NodejsFunction(this, 'AuthFunction', {
      functionName: 'BharatBazaar-Auth',
      entry: path.join(handlersDir, 'auth.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: commonEnv,
      bundling: commonBundling,
      description: 'User Authentication — register, login, profile management',
    });

    // Holidays Lambda
    const holidaysFn = new nodejs.NodejsFunction(this, 'HolidaysFunction', {
      functionName: 'BharatBazaar-Holidays',
      entry: path.join(handlersDir, 'holidays.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: commonEnv,
      bundling: commonBundling,
      description: 'Holiday Demand Intelligence — holiday listings and AI stock recommendations',
    });

    // Notification Lambda
    const notificationFn = new nodejs.NodejsFunction(this, 'NotificationsFunction', {
      functionName: 'BharatBazaar-Notifications',
      entry: path.join(handlersDir, 'notifications.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: {
        ...commonEnv,
        SNS_TOPIC_ARN: notificationTopic.topicArn,
        SES_FROM_EMAIL: 'noreply@bharatbazaar.ai',
      },
      bundling: commonBundling,
      description: 'Notification Service — email, SMS, weekly digest',
    });

    // --- Notification Worker Lambda (SQS consumer with retry) ---

    const notificationWorkerFn = new nodejs.NodejsFunction(this, 'NotificationWorkerFunction', {
      functionName: 'BharatBazaar-NotificationWorker',
      entry: path.join(handlersDir, 'notification-worker.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: {
        DYNAMODB_TABLE_NAME: props.table.tableName,
        SNS_TOPIC_ARN: notificationTopic.topicArn,
        SES_FROM_EMAIL: 'noreply@bharatbazaar.ai',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        NODE_OPTIONS: '--enable-source-maps',
      },
      bundling: commonBundling,
      description: 'Notification Worker — SQS consumer, sends email/SMS with retry',
    });

    // Wire SQS Queue → Worker Lambda
    notificationWorkerFn.addEventSource(
      new lambdaEventSources.SqsEventSource(notificationQueue, {
        batchSize: 5,
        maxBatchingWindow: cdk.Duration.seconds(10),
        reportBatchItemFailures: true,
      })
    );

    // DynamoDB permissions
    props.table.grantReadWriteData(pricingFn);
    props.table.grantReadWriteData(descriptionsFn);
    props.table.grantReadWriteData(sentimentFn);
    props.table.grantReadData(dashboardFn);
    props.table.grantReadWriteData(holidaysFn);
    props.table.grantReadWriteData(authFn);
    props.table.grantReadWriteData(notificationFn);
    props.table.grantReadWriteData(notificationWorkerFn);

    // Cognito permissions for auth Lambda
    userPool.grant(authFn, 'cognito-idp:AdminCreateUser', 'cognito-idp:AdminInitiateAuth', 'cognito-idp:AdminGetUser');

    // SES + SNS permissions for the worker (it does the actual sending)
    const sesPolicy = new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'],
    });
    const snsPublishPolicy = new iam.PolicyStatement({
      actions: ['sns:Publish'],
      resources: [notificationTopic.topicArn],
    });
    notificationWorkerFn.addToRolePolicy(sesPolicy);
    notificationWorkerFn.addToRolePolicy(snsPublishPolicy);

    // SQS send permissions for all producer Lambdas
    const sqsSendPolicy = new iam.PolicyStatement({
      actions: ['sqs:SendMessage'],
      resources: [notificationQueue.queueArn],
    });
    for (const fn of [pricingFn, descriptionsFn, sentimentFn, holidaysFn, authFn, notificationFn]) {
      fn.addToRolePolicy(sqsSendPolicy);
    }

    // EventBridge rule — weekly digest every Monday 3:00 AM UTC (8:30 AM IST)
    new events.Rule(this, 'WeeklyDigestRule', {
      ruleName: 'BharatBazaar-WeeklyDigest',
      schedule: events.Schedule.cron({ minute: '0', hour: '3', weekDay: 'MON' }),
      targets: [new targets.LambdaFunction(notificationFn, {
        event: events.RuleTargetInput.fromObject({ source: 'aws.events', type: 'WEEKLY_DIGEST' }),
      })],
    });

    // --- CloudWatch Alarm: DLQ has messages (delivery failures) ---

    const dlqAlarm = new cloudwatch.Alarm(this, 'NotificationDLQAlarm', {
      alarmName: 'BharatBazaar-NotificationDLQ-Depth',
      alarmDescription: 'Notification DLQ has messages — delivery failures detected',
      metric: notificationDLQ.metricApproximateNumberOfMessagesVisible({
        period: cdk.Duration.minutes(1),
        statistic: 'Sum',
      }),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    dlqAlarm.addAlarmAction(
      new cloudwatchActions.SnsAction(notificationTopic)
    );

    // --- API Gateway (REST API) ---

    const api = new apigateway.RestApi(this, 'BharatBazaarApi', {
      restApiName: 'BharatBazaar AI API',
      description: 'BharatBazaar AI — Market Intelligence for Indian Retail',
      deployOptions: {
        stageName: 'v1',
        throttlingRateLimit: 100,
        throttlingBurstLimit: 200,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    this.api = api;

    // Cognito Authorizer
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'BharatBazaarAuthorizer', {
      cognitoUserPools: [userPool],
      authorizerName: 'BharatBazaarCognitoAuth',
    });

    const authMethodOptions: apigateway.MethodOptions = {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    };

    // Routes
    const apiResource = api.root.addResource('api');

    // Protected routes (require JWT)
    const pricing = apiResource.addResource('pricing');
    pricing.addResource('recommend').addMethod(
      'POST',
      new apigateway.LambdaIntegration(pricingFn),
      authMethodOptions,
    );

    const content = apiResource.addResource('content');
    content.addResource('generate').addMethod(
      'POST',
      new apigateway.LambdaIntegration(descriptionsFn),
      authMethodOptions,
    );

    const sentiment = apiResource.addResource('sentiment');
    sentiment.addResource('analyze').addMethod(
      'POST',
      new apigateway.LambdaIntegration(sentimentFn),
      authMethodOptions,
    );

    apiResource.addResource('dashboard').addMethod(
      'GET',
      new apigateway.LambdaIntegration(dashboardFn),
    );

    // Holiday routes
    const holidays = apiResource.addResource('holidays');
    holidays.addMethod('GET', new apigateway.LambdaIntegration(holidaysFn)); // list (public)
    const holidayById = holidays.addResource('{holidayId}');
    holidayById.addMethod('GET', new apigateway.LambdaIntegration(holidaysFn)); // detail (public)
    holidayById.addResource('recommendations').addMethod(
      'GET',
      new apigateway.LambdaIntegration(holidaysFn),
      authMethodOptions, // AI recommendations require auth
    );

    // Public routes (no auth)
    const auth = apiResource.addResource('auth');
    auth.addResource('register').addMethod('POST', new apigateway.LambdaIntegration(authFn));
    auth.addResource('login').addMethod('POST', new apigateway.LambdaIntegration(authFn));
    auth.addResource('forgot-password').addMethod('POST', new apigateway.LambdaIntegration(authFn));
    auth.addResource('reset-password').addMethod('POST', new apigateway.LambdaIntegration(authFn));
    auth.addResource('profile').addMethod('GET', new apigateway.LambdaIntegration(authFn), authMethodOptions);
    auth.addResource('profile-update').addMethod('PUT', new apigateway.LambdaIntegration(authFn), authMethodOptions);

    // Notification preference routes (protected)
    const notifications = apiResource.addResource('notifications');
    notifications.addResource('preferences').addMethod('GET', new apigateway.LambdaIntegration(notificationFn), authMethodOptions);
    notifications.addResource('preferences-update').addMethod('PUT', new apigateway.LambdaIntegration(notificationFn), authMethodOptions);

    apiResource.addResource('health').addMethod(
      'GET',
      new apigateway.MockIntegration({
        integrationResponses: [{
          statusCode: '200',
          responseTemplates: {
            'application/json': JSON.stringify({
              status: 'healthy',
              service: 'BharatBazaar AI',
              version: '1.0.0',
            }),
          },
        }],
        requestTemplates: { 'application/json': '{"statusCode": 200}' },
      }),
      { methodResponses: [{ statusCode: '200' }] },
    );

    // --- Outputs ---
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway base URL',
    });
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      description: 'Cognito User Pool ID',
    });
    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
    });
    new cdk.CfnOutput(this, 'SNSTopicArn', {
      value: notificationTopic.topicArn,
      description: 'SNS Notification Topic ARN',
    });
    new cdk.CfnOutput(this, 'NotificationQueueUrl', {
      value: notificationQueue.queueUrl,
      description: 'SQS Notification Queue URL',
    });
    new cdk.CfnOutput(this, 'NotificationDLQUrl', {
      value: notificationDLQ.queueUrl,
      description: 'SQS Notification Dead Letter Queue URL',
    });
    new cdk.CfnOutput(this, 'DLQAlarmName', {
      value: dlqAlarm.alarmName,
      description: 'CloudWatch Alarm for DLQ depth',
    });
  }
}
