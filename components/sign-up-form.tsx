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


const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  repeatPassword: z.string().min(6),
})

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const {register, handleSubmit,setError, formState: {errors,isSubmitting}} = useForm({resolver: zodResolver(signUpSchema)})
  const router = useRouter()

  const handleSignUp = async (data: z.infer<typeof signUpSchema>) => {
    const {email, password, repeatPassword} = data
    const supabase = createClient()
    

    if (password !== repeatPassword) {
      setError("repeatPassword",{message:'Passwords do not match'})
    
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          channel: "whatsapp",
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: any) {
      setError("root",{message: error?.message ?? 'An error occurred'}, {shouldFocus: true})
    } 
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSignUp)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input {...register("email")} />
                <Label className="text-red-600">{errors.email?.message?.toString()}</Label>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input {...register("password")} type="password" />
                <Label className="text-red-600">{errors.password?.message?.toString()}</Label>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                </div>
                <Input {...register("repeatPassword")} type="password" />
                <Label className="text-red-600">{errors.repeatPassword?.message?.toString()}</Label>
              </div>
              {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating an account...' : 'Sign up'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
