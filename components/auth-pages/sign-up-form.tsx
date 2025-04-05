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
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShoppingCart, LayoutGrid, User, Mail, Lock } from 'lucide-react'

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  repeatPassword: z.string().min(6, 'Password must be at least 6 characters'),
  userType: z.enum(['buyer', 'seller'])
})

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const searchParams = useSearchParams()
  const defaultUserType = searchParams.get('userType') === 'seller' ? 'seller' : 'buyer'
  const [userType, setUserType] = useState<'buyer' | 'seller'>(defaultUserType as 'buyer' | 'seller')
  
  const {register, handleSubmit, setError, setValue, formState: {errors, isSubmitting}} = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userType: defaultUserType
    }
  })
  
  const router = useRouter()

  useEffect(() => {
    setValue('userType', userType)
  }, [userType, setValue])

  const handleUserTypeChange = (value: string) => {
    if (value === 'buyer' || value === 'seller') {
      setUserType(value)
      setValue('userType', value)
    }
  }

  const handleSignUp = async (data: z.infer<typeof signUpSchema>) => {
    const {name, email, password, repeatPassword, userType} = data
    const supabase = createClient()
    
    if (password !== repeatPassword) {
      setError("repeatPassword", {message: 'Passwords do not match'})
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            name,
            user_type: userType
          }
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
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
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-purple-100 text-sm max-w-xs mx-auto">Join us to start buying or selling digital products</p>
            
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
                <User className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        <CardContent className="pt-10 px-6 pb-6">
          <form onSubmit={handleSubmit(handleSignUp)}>
            <div className="space-y-5">
              <Tabs 
                defaultValue={userType} 
                value={userType}
                onValueChange={handleUserTypeChange}
                className="w-full"
              >
                <TabsList variant="auth" className="p-1">
                  <TabsTrigger 
                    value="buyer"
                    variant="buyer"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Buyer
                  </TabsTrigger>
                  <TabsTrigger 
                    value="seller"
                    variant="seller"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Seller
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Full Name
                  </div>
                </Label>
                <Input 
                  {...register("name")} 
                  variant="auth"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 pl-2">{errors.name.message}</p>
                )}
              </div>

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
                <Label htmlFor="password" className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    Password
                  </div>
                </Label>
                <Input 
                  {...register("password")} 
                  type="password" 
                  variant="auth"
                  placeholder="Create a secure password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 pl-2">{errors.password.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="repeatPassword" className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    Confirm Password
                  </div>
                </Label>
                <Input 
                  {...register("repeatPassword")} 
                  type="password" 
                  variant="auth"
                  placeholder="Repeat your password"
                />
                {errors.repeatPassword && (
                  <p className="text-sm text-red-500 pl-2">{errors.repeatPassword.message}</p>
                )}
              </div>

              {errors.root && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                  <p className="text-sm">{errors.root.message}</p>
                </div>
              )}

              <input type="hidden" {...register("userType")} value={userType} />

              <Button 
                type="submit" 
                variant="gradient" 
                size="xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-purple-600 hover:text-purple-700 underline-offset-4 hover:underline transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
