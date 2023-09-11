import crypto from 'crypto';
import bcrypt from 'bcrypt';

import { AuthConfig, EncryptionConfig } from '@swiq/common';
import {
  MISSING_ENCRYPTION_IV,
  MISSING_ENCRYPTION_KEY,
  MISSING_JWT_EXPIRE_IN,
  MISSING_JWT_SECRET,
} from '@swiq/common/errors';

export const parseEncryptionConfigFromEnv = (): EncryptionConfig => {
  if (!process.env['ENCRYPTION_KEY']) {
    throw new Error(MISSING_ENCRYPTION_KEY);
  }

  if (!process.env['ENCRYPTION_IV']) {
    throw new Error(MISSING_ENCRYPTION_IV);
  }

  return {
    key: process.env['ENCRYPTION_KEY'],
    iv: process.env['ENCRYPTION_IV'],
  };
};

export const parseAuthConfigFromEnv = (): AuthConfig => {
  if (!process.env['JWT_SECRET']) {
    throw new Error(MISSING_JWT_SECRET);
  }

  if (!process.env['JWT_EXPIRE_IN']) {
    throw new Error(MISSING_JWT_EXPIRE_IN);
  }

  return {
    jwtSecret: process.env['JWT_SECRET'],
    expireIn: Number(process.env['JWT_EXPIRE_IN']),
  };
};

// Encryption function
export const encryptDeterministic = (text: string, key: string, iv: string) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Decryption function
export const decryptDeterministic = (
  encryptedText: string,
  key: string,
  iv: string,
) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export const hashPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, 10);

  return hash;
};

export const comparePasswordWithHash = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateRandomHash = (): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < 50; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
};
