"use client";

import type { AccessTokenResponse } from "src/types/auth";

import { CONFIG } from "src/config-global";
import axios, { endpoints } from "src/utils/axios";

import { setSession } from "./utils";

// ----------------------------------------------------------------------

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
    const params = { email, password };

    const res = await axios.post<AccessTokenResponse>(
      endpoints.auth.signIn,
      params,
    );

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error("Access token not found in response");
    }

    setSession(accessToken);
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
    await setSession(null);
  } catch (error) {
    console.error("Error during sign out:", error);
    throw error;
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
