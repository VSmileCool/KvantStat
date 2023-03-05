export interface AuthState {
  isAuthenticated: boolean;
  user: {
    certificateCode: string;
    email: string;
    password: string;
    fullName: string;
    graduationYear: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};
