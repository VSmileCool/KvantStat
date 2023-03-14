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
    const response = await axios.post<User>(
      "http://localhost:4000/auth/login",
      {
        email,
        password,
      }
    );
    console.log(response.data);
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
    const response = await axios.post<User>(
      "http://localhost:4000/auth/registration",
      user
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post("http://localhost:4000/auth/logout");
  },
};
