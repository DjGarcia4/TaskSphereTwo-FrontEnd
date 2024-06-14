import api from "@/lib/axios";
import {
  ConfirmToken,
  RequestConfirmationCodeForm,
  UserLoginForm,
  UserRegistrationForm,
} from "../types";
import { isAxiosError } from "axios";

export async function createAccount(formData: UserRegistrationForm) {
  try {
    const url = `/auth/create-account`;
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function confirmAccount(token: ConfirmToken) {
  try {
    const url = `/auth/confirm-account`;
    const { data } = await api.post<string>(url, token);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function requestConfirmationCode(
  email: RequestConfirmationCodeForm
) {
  try {
    const url = `/auth/request-code`;
    const { data } = await api.post<string>(url, email);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function login(formData: UserLoginForm) {
  try {
    const url = `/auth/login`;
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
