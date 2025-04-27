import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SigninStart, SigninSuccess, SigninFailure } from '../user/userSlice'
import GoogleAuth from '../components/GoogleAuth'
import { useTranslation } from 'react-i18next'

export default function Signin() {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(SigninStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      console.log(data)
      if (data.sucess === false) {
        dispatch(SigninFailure(data.message))
        return
      }
      dispatch(SigninSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(SigninFailure(error.message))
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        {t('auth.signIn')}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder={t('auth.email')}
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder={t('auth.password')}
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-blue-500 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
          {loading ? t('common.loading') : t('auth.signIn')}
        </button>
      </form>
      <GoogleAuth />

      <div className="flex gap-2 mt-5">
        <p> Dont have an account? </p>
        <Link to={'/sign-up'}>
          <span className="text-blue-700">{t('auth.signUp')}</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  )
}
