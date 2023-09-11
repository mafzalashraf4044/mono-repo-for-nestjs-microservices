import { ClientPlatform } from '../enums';

export const isWebsiteEnvironmentHeaderPresent = (req: any): boolean => {
  const environmentHeader = req.headers['x-environment-identifier'];
  return environmentHeader === ClientPlatform.Website;
};

export const isMobileEnvironmentHeaderPresent = (req: any): boolean => {
  const environmentHeader = req.headers['x-environment-identifier'];
  return environmentHeader === ClientPlatform.MobileApp;
};

export const isXAuthPasswordlessPresent = (
  req: Request,
): string | undefined => {
  const token = req.headers.get('x-auth-passwordless')?.toString();
  return token;
};

export const isMobileEnvironmentUserAgentPresent = (req: any): boolean => {
  const userAgentHeader = req.headers['user-agent'] as string;

  if (!userAgentHeader) return false;

  const lowerCaseUserAgent = userAgentHeader.toLowerCase();

  const isMobileUserAgentPresent =
    lowerCaseUserAgent.includes('android') ||
    lowerCaseUserAgent.includes('iphone') ||
    lowerCaseUserAgent.includes('ipad');

  return isMobileUserAgentPresent;
};
