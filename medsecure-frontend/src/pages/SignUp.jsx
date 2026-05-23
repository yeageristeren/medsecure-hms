import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { AlertCircle } from 'lucide-react'
import { signup } from '../services/authService'

function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '', name: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const validate = () => {
    if (!form.name.trim()) return setError('Full name is required.') || false
    if (!form.username.trim()) return setError('Email is required.') || false
    if (!/\S+@\S+\.\S+/.test(form.username)) return setError('Please enter a valid email address.') || false
    if (form.password.length < 4) return setError('Password must be at least 4 characters.') || false
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.') || false
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setIsLoading(true)
    try {
      await signup({
        username: form.username,
        password: form.password,
        name: form.name,
        roles: ['PATIENT'],
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-10 pb-10 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-emerald-600 text-3xl">✓</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Account created!</h2>
              <p className="text-gray-500 text-sm">
                Your MedSecure account has been successfully created. You can now sign in.
              </p>
              <Button
                className="w-full h-10 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200"
                onClick={() => navigate('/')}
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-base">
              Sign up for your MedSecure account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Mohit Sharma"
                  value={form.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-10 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Email address</Label>
                <Input
                  id="username"
                  name="username"
                  type="email"
                  placeholder="you@example.com"
                  value={form.username}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-10 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-10 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-10 rounded-lg"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </Button>

            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                Already have an account?{' '}
                <a href="/" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                  Sign in here
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2026 MedSecure. All rights reserved.
        </p>

      </div>
    </div>
  )
}

export default SignUp