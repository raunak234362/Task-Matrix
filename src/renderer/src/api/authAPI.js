/* eslint-disable prettier/prettier */
import { BASE_URL } from "../config/constant";
import axios from 'axios'
class AuthService {

  static async login({ username, password }) {
    try {
      const formData = new URLSearchParams()
      formData.append('username', username.toUpperCase())
      formData.append('password', password)
       
      const response = await axios.post(`${BASE_URL}/auth/login/`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }) 
      console.log(response)
      if (response.status === 400) {
        throw new Error('Invalid Credentials')  
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('Invalid Credentials')
      } else {
        console.error('Error in login:', error)
        throw new Error('Could not connect to server')
      }
    }
  }
}

export default AuthService;
