"use client";

import { CONFIG } from "src/config-global";
import axios, { endpoints } from "src/utils/axios";
import { PERSONAL_DATA_CONSENT_VERSION } from "src/constants/privacy";

// ----------------------------------------------------------------------
// Auth is cookie-based: the backend sets httpOnly access/refresh cookies and a
// readable CSRF cookie on the sign-in response. The client never handles the
// token — after sign-in it just re-checks the session via /me.

interface SignInParams {
  email: string;
  password: string;
  personalDataConsent?: boolean;
}

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({
  email,
  password,
  personalDataConsent,
}: SignInParams): Promise<void> => {
  // On success the backend sets the auth cookies; nothing to store client-side.
  await axios.post(endpoints.auth.signIn, {
    email,
    password,
    ...(personalDataConsent && {
      personalDataConsent: true,
      personalDataConsentVersion: PERSONAL_DATA_CONSENT_VERSION,
    }),
  });
};

// ----------------------------------------------------------------------

interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  personalDataConsent: boolean;
}

interface SignUpResponse {
  message: string;
}

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
  personalDataConsent,
}: SignUpParams): Promise<SignUpResponse> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
    personalDataConsent,
    personalDataConsentVersion: PERSONAL_DATA_CONSENT_VERSION,
  };

  const res = await axios.post<SignUpResponse>(endpoints.auth.signUp, params);
  return res.data;
};

// ----------------------------------------------------------------------

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    // Server revokes the refresh-token family and clears the auth cookies.
    // Best-effort: even if the request fails, the caller clears local state.
    await axios.post(endpoints.auth.signOut);
  } catch (error) {
    console.error("Error during sign out:", error);
  }
};

/** **************************************
 * Sign out everywhere (all devices/sessions)
 *************************************** */
export const signOutAllSessions = async (): Promise<void> => {
  try {
    await axios.post(endpoints.auth.signOutAll);
  } catch (error) {
    console.error("Error during sign out (all sessions):", error);
  }
};

// ----------------------------------------------------------------------

export const signInWithGoogle = () => {
  if (!CONFIG.site.serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is not configured");
  }

  window.location.href = `${CONFIG.site.serverUrl}${endpoints.auth.google}`;
};

export const signInWithYandex = () => {
  if (!CONFIG.site.serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is not configured");
  }

  window.location.href = `${CONFIG.site.serverUrl}${endpoints.auth.yandex}`;
};

export const completeOAuthConsent = async (token: string): Promise<void> => {
  await axios.post(endpoints.auth.oauthConsent, {
    token,
    personalDataConsent: true,
    personalDataConsentVersion: PERSONAL_DATA_CONSENT_VERSION,
  });
};
