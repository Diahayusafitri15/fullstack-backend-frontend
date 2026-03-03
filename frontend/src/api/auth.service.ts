import axiosInstance from "./axios";

export interface LoginResponse {
  token: string;
  role: "ADMIN" | "USER";
}

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  return axiosInstance.post<LoginResponse>("/users/login", data);
};