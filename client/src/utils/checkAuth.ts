import axiosInstance from "./axiosAuth";
import {
  getAccessTokenLS,
  getRefreshTokenLS,
  setAccessTokenLS,
} from "./localStorage";

export const checkAuthentication = async (): Promise<Boolean> => {
  const accessToken = getAccessTokenLS();
  const refreshToken = getRefreshTokenLS();

  if (!accessToken) {
    return false;
  }

  try {
    await axiosInstance.get("/user/test/", {
      headers: { Authorization: `Token ${accessToken}` },
    });

    return true;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      if (!refreshToken) {
        return false;
      }

      try {
        const response = await axiosInstance.post("user/refresh/", {
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        setAccessTokenLS(newAccessToken);

        await axiosInstance.get("/user/test/", {
          headers: { Authorization: `Token ${newAccessToken}` },
        });

        return true;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        return false;
      }
    } else {
      console.error("Error checking authentication:", error);
      return false;
    }
  }
};
