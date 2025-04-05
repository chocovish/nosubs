'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BrandLogo } from '@/components/header/brand-logo'
import { Mail, Lock, LogIn } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const {register, handleSubmit, setError, formState: {errors, isSubmitting}} = useForm({
    resolver: zodResolver(loginSchema)
  })
  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const email = data.email
    const password = data.password
    const supabase = createClient()
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password, 
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: any) {
      setError("root", {message: error?.message ?? 'An error occurred'}, {shouldFocus: true})
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden border-none shadow-xl bg-white/95 backdrop-blur-sm rounded-xl max-w-md w-full mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 opacity-90"></div>
          <div className="relative py-8 px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-purple-100 text-sm max-w-xs mx-auto">Sign in to access your account</p>
            
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
                <LogIn className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        <CardContent className="pt-10 px-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email Address
                  </div>
                </Label>
                <Input 
                  {...register("email")} 
                  variant="auth"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 pl-2">{errors.email.message}</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      Password
                    </div>
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  {...register("password")} 
                  type="password" 
                  variant="auth"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 pl-2">{errors.password.message}</p>
                )}
              </div>
              
              {errors.root && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                  <p className="text-sm">{errors.root.message}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                variant="gradient" 
                size="xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/sign-up" className="font-medium text-purple-600 hover:text-purple-700 underline-offset-4 hover:underline transition-colors">
                Create an account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
