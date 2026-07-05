"use client";

import { CONFIG } from "src/config-global";
import axios, { endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------
// Auth is cookie-based: the backend sets httpOnly access/refresh cookies and a
// readable CSRF cookie on the sign-in response. The client never handles the
// token — after sign-in it just re-checks the session via /me.

interface SignInParams {
  email: string;
  password: string;
}

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({
  email,
  password,
}: SignInParams): Promise<void> => {
  try {
    // On success the backend sets the auth cookies; nothing to store client-side.
    await axios.post(endpoints.auth.signIn, { email, password });
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------

interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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
}: SignUpParams): Promise<SignUpResponse> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post<SignUpResponse>(endpoints.auth.signUp, params);
    return res.data;
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
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
