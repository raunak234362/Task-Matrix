/* eslint-disable prettier/prettier */
import axios from 'axios'
import { BASE_URL } from './constant'

class AuthService {
  static async login({ username, password, token, userType }) {
    try {
      const formData = new URLSearchParams()
      formData.append('username', username.toUpperCase())
      formData.append('password', password)

      const response = await axios.post(`${BASE_URL}api/user/login/`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      sessionStorage.setItem('token', token)
      localStorage.setItem('userType', userType)
    return response.data
    } catch (error) {
      console.error('Error in login:', error)
      throw error
    }
  }
}

export default AuthService
