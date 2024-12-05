/* eslint-disable prettier/prettier */
import LOGO from '../assets/logo.png'
import Background from '../assets/background-image.jpg'
// import { Link } from 'react-router-dom'
import { Button, Input } from '../index'
import { useForm } from 'react-hook-form'
import AuthService from '../../config/authAPI'
import Service from '../../config/Service'
import { useDispatch } from 'react-redux'

const Login = () => {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const login = async (data) => {
    try {
      const session = await AuthService.login(data)
      if (session && session.token) {
        const token = session.token
        const userData = await Service.getCurrentUser(token)

        let userType = ''

        if (userData.is_superuser) {
          userType = 'admin'
        } else if (userData.is_staff) {
          userType = 'manager'
        } else {
          userType = 'user'
        }
        sessionStorage.setItem('userType', userType)
        sessionStorage.setItem('username', userData?.username)
        sessionStorage.setItem('token', token)
        // dispatch(authLogin(session))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div className="w-screen grid md:grid-cols-2 grid-cols-1 z-10 fixed">
        <div className={`md:flex md:my-0 mt-10 md:h-screen justify-center items-center`}>
          <div className="fixed bg-white md:w-auto bg-opacity-70 border-4 rounded-2xl md:py-14 md:px-20 px-2 mx-20 flex justify-center items-center z-10">
            <img src={LOGO} alt="Logo" />
          </div>
        </div>
        <div className="md:bg-green-400 h-screen flex justify-center items-center">
          <div className="bg-white md:bg-opacity-100 bg-opacity-60 h-fit w-[80%] md:w-2/3 rounded-2xl shadow-lg shadow-gray-600 border-4 border-white md:border-green-500 p-5">
            <h1 className="text-4xl font-bold text-center text-gray-600 mb-10">Login</h1>
            <form onSubmit={handleSubmit(login)} className="flex w-full flex-col gap-5">
              <div>
                <Input
                  label="Username:"
                  placeholder="USERNAME"
                  type="text"
                  {...register('username', {
                    required: 'Username is required'
                  })}
                />
                {errors.username && <p className="text-red-500">{errors.username.message}</p>}
              </div>
              <div>
                <Input
                  label="Password:"
                  placeholder="PASSWORD"
                  type="password"
                  {...register('password', {
                    required: 'Password is required'
                  })}
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>
              <div className="w-full flex my-5 justify-center">
                <Button type="submit" className="w-[80%]">
                  Sign IN
                </Button>
              </div>
            </form>
            <div></div>
          </div>
        </div>
      </div>
      <div>
        <img
          src={Background}
          alt="background"
          className="h-screen w-screen object-cover blur-[8px]"
        />
      </div>
    </div>
  )
}

export default Login
