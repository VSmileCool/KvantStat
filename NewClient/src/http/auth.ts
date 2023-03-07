import axios from "axios";

export interface User {
  certificateCode: string;
  email: string;
  password: string;
  fullName: string;
  graduationYear: string;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    console.log("AUTH");
    const response = await axios.post<User>(
      "http://localhost:/4000/auth/registration",
      {
        email,
        password,
      }
    );
    return response.data;
  },

  async register(user: {
    email: string;
    password: string;
    certificateCode: string;
    firstName: string;
    lastName: string;
    patronymic: string;
    graduationYear: string;
  }): Promise<User> {
    const response = await axios.post<User>("/api/register", user);
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post("/api/logout");
  },
};
