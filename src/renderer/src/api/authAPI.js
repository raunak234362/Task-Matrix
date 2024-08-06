import { BASE_URL } from "../config/constant";

class AuthService {
  static BASE_URL = BASE_URL;

  static async login({ username, password,token,userType }) {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${AuthService.BASE_URL}api/user/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });
      sessionStorage.setItem("token",token)
      localStorage.setItem("userType",userType)
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }
}

export default AuthService;
