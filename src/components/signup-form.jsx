"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import HCaptcha from "@hcaptcha/react-hcaptcha"
import { Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle } from "lucide-react"
import useSession from "@/lib/supabase/use-session"

export function SignupForm({ className, ...props }) {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [cpass, setCpass] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [captchaToken, setCaptchaToken] = useState()
  const captcha = useRef();
  const user = useSession()?.user;

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError("")
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/dashboard`,
          captchaToken,
        },
      })
    } catch (err) {
      setError("Failed to sign in with Google")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailPassLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (cpass !== pass) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (pass.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: pass,
        options: {
          redirectTo: `${location.origin}/login`,
          captchaToken,
        },
      })

      if (error) {
        setError(error.message)
      } else if (data) {
        router.push("/login")
      }

      if (captcha.current) {
        captcha.current.resetCaptcha()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    setIsLoading(true)
    setError("")
    try {
      await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${location.origin}/dashboard`,
          captchaToken,
        },
      })
    } catch (err) {
      setError("Failed to sign in with Facebook")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    if(user){
      router.push('/dashboard')
    }
  },[user]);

  return (
    <Card className={cn("w-full border-0 shadow-lg bg-white", className)} {...props}>
      <CardHeader className="text-center pb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <UserPlus className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Create account
        </CardTitle>
        <CardDescription className="text-slate-600">Enter your details to get started</CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <form onSubmit={handleEmailPassLogin} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-slate-700 font-medium flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Label>
            <Input
              autoComplete="off"
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 h-10 text-lg text-black"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-3">
            <Label htmlFor="password" className="text-slate-700 font-medium flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Password</span>
            </Label>
            <div className="relative">
              <Input
                autoComplete="off"
                id="password"
                type={showPassword ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 h-10 text-lg pr-12 text-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-slate-700 font-medium flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Confirm Password</span>
            </Label>
            <div className="relative">
              <Input
                autoComplete="off"
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={cpass}
                onChange={(e) => setCpass(e.target.value)}
                required
                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 h-10 text-lg pr-12 text-black"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* CAPTCHA */}
          <div className="flex justify-center">
            <HCaptcha
              theme="light"
              ref={captcha}
              sitekey="108a337e-fd2c-437a-88b6-14f02de823f6"
              onVerify={(token) => {
                setCaptchaToken(token)
              }}
            />
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Divider */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-slate-200">
            <span className="bg-white text-slate-500 relative z-10 px-4">Or continue with</span>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="border-slate-200 hover:bg-slate-50 hover:border-blue-300 py-3 rounded-full transition-all duration-300"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="#000000"
                />
              </svg>
              <span className="sr-only">Login with Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="border-slate-200 hover:bg-slate-50 hover:border-blue-300 py-3 rounded-full transition-all duration-300"
              onClick={handleFacebookLogin}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  fill="#000000"
                />
              </svg>
              <span className="sr-only">Login with Facebook</span>
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4 transition-colors"
            >
              Sign in
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
