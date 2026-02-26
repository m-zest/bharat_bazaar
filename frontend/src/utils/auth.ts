import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

// Cognito config — set these via environment variables or after CDK deploy
const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID || '';
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || '';

const poolData = {
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
};

let userPool: CognitoUserPool | null = null;

function getPool(): CognitoUserPool {
  if (!userPool) {
    if (!USER_POOL_ID || !CLIENT_ID) {
      throw new Error('Cognito not configured. Set VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID.');
    }
    userPool = new CognitoUserPool(poolData);
  }
  return userPool;
}

export interface SignUpParams {
  email: string;
  password: string;
  fullName?: string;
  businessName?: string;
  city?: string;
  businessCategory?: string;
}

export function signUp(params: SignUpParams): Promise<{ userId: string; confirmed: boolean }> {
  const email = params.email.toLowerCase().trim();
  return new Promise((resolve, reject) => {
    const attributes: CognitoUserAttribute[] = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
    ];
    if (params.fullName) {
      attributes.push(new CognitoUserAttribute({ Name: 'name', Value: params.fullName }));
    }
    if (params.businessName) {
      attributes.push(new CognitoUserAttribute({ Name: 'custom:businessName', Value: params.businessName }));
    }
    if (params.city) {
      attributes.push(new CognitoUserAttribute({ Name: 'custom:city', Value: params.city }));
    }
    if (params.businessCategory) {
      attributes.push(new CognitoUserAttribute({ Name: 'custom:businessCategory', Value: params.businessCategory }));
    }

    getPool().signUp(email, params.password, attributes, [], (err, result) => {
      if (err) return reject(err);
      resolve({
        userId: result?.userSub || '',
        confirmed: result?.userConfirmed || false,
      });
    });
  });
}

export function confirmSignUp(rawEmail: string, code: string): Promise<void> {
  const email = rawEmail.toLowerCase().trim();
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: getPool() });
    user.confirmRegistration(code, true, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function signIn(rawEmail: string, password: string): Promise<CognitoUserSession> {
  const email = rawEmail.toLowerCase().trim();
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: getPool() });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
    });
  });
}

export function forgotPassword(rawEmail: string): Promise<void> {
  const email = rawEmail.toLowerCase().trim();
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: getPool() });
    user.forgotPassword({
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
      inputVerificationCode: () => resolve(),
    });
  });
}

export function resetPassword(rawEmail: string, code: string, newPassword: string): Promise<void> {
  const email = rawEmail.toLowerCase().trim();
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: getPool() });
    user.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    });
  });
}

export function signOut(): void {
  const user = getPool().getCurrentUser();
  if (user) user.signOut();
}

export function getToken(): Promise<string | null> {
  return new Promise((resolve) => {
    const user = getPool().getCurrentUser();
    if (!user) return resolve(null);

    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) return resolve(null);
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

export function getCurrentUser(): CognitoUser | null {
  try {
    return getPool().getCurrentUser();
  } catch {
    return null;
  }
}

export function isConfigured(): boolean {
  return !!USER_POOL_ID && !!CLIENT_ID;
}
