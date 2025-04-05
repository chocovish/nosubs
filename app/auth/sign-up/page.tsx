import { SignUpForm } from '@/components/auth-pages/sign-up-form'
import { Suspense } from 'react'

export default function Page() {
  return (
    <div className="flex justify-center pt-8 md:pt-16">
      <Suspense>
      <SignUpForm />
      </Suspense>
    </div>
  )
}
