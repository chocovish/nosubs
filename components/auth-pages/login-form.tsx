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

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const {register, handleSubmit,setError, formState: {errors,isSubmitting}} = useForm({resolver: zodResolver(loginSchema)})
  // const [error, setError] = useState<string | null>(null)
  const router = useRouter()


  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    console.log(data)
    const email=data.email
    const password=data.password
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password, 
      })
      if (error) throw error
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push('/dashboard')
    } catch (error: any) {
      setError("root",{message: error?.message ?? 'An error occurred'}, {shouldFocus: true})
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input {...register("email")} />
                <Label className="text-red-600">{errors.email?.message?.toString()}</Label>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input {...register("password")} type="password" />
                <Label className="text-red-600">{errors.password?.message?.toString()}</Label>
              </div>
              {errors.root?.message && <p className="text-sm text-red-500">{errors.root?.message}</p>}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
