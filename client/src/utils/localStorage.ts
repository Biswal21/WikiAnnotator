import { AuthenticatedUserData, TokenData } from "../types/interfaces";

export const setTokenLS = (tokenObj: AuthenticatedUserData) => {
  localStorage.setItem("access_token", tokenObj.access_token);
  localStorage.setItem("refresh_token", tokenObj.refresh_token);
  localStorage.setItem("group", JSON.stringify(tokenObj.groups));
};

export const setAccessTokenLS = (access: string) => {
  localStorage.setItem("access_token", access);
};

export const getAccessTokenLS = (): string | null => {
  return localStorage.access_token;
};

export const removeAccessTokenLS = () => {
  localStorage.removeItem("access_token");
};

export const getRefreshTokenLS = (): string | null => {
  return localStorage.refresh_token;
};

export const clearTokenLS = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("group");
};
