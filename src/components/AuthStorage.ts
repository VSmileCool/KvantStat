class AuthService {
  private static ACCESS_TOKEN_KEY = "access_token";

  // Save access token to localStorage
  static saveAccessToken(token: string): void {
    localStorage.setItem(AuthService.ACCESS_TOKEN_KEY, token);
  }

  // Get access token from localStorage
  static getAccessToken(): string | null {
    return localStorage.getItem(AuthService.ACCESS_TOKEN_KEY);
  }

  // Clear access token from localStorage
  static clearAccessToken(): void {
    localStorage.removeItem(AuthService.ACCESS_TOKEN_KEY);
  }
}

export default AuthService;
