import Cookies from 'js-cookie';
import type { AstroCookies } from 'astro';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_EXPIRATION_DAYS = 7;

export function verifyCredentials(username: string, password: string): boolean {
  const adminUsername = import.meta.env.ADMIN_USERNAME;
  const adminPassword = import.meta.env.ADMIN_PASSWORD;

  return username === adminUsername && password === adminPassword;
}

export function setSessionCookie(token: string, cookies?: AstroCookies): void {
  if (cookies) {
    cookies.set(SESSION_COOKIE_NAME, token, { expires: new Date(Date.now() + SESSION_EXPIRATION_DAYS * 24 * 60 * 60 * 1000), secure: import.meta.env.PROD, httpOnly: true, path: '/' });
  } else {
    Cookies.set(SESSION_COOKIE_NAME, token, { expires: SESSION_EXPIRATION_DAYS, secure: import.meta.env.PROD });
  }
}

export function getSessionCookie(cookies?: AstroCookies): string | undefined {
  if (cookies) {
    return cookies.get(SESSION_COOKIE_NAME)?.value;
  } else {
    return Cookies.get(SESSION_COOKIE_NAME);
  }
}

export function removeSessionCookie(cookies?: AstroCookies): void {
  if (cookies) {
    cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
  } else {
    Cookies.remove(SESSION_COOKIE_NAME);
  }
}

export function isAuthenticated(cookies?: AstroCookies): boolean {
  return !!getSessionCookie(cookies);
}