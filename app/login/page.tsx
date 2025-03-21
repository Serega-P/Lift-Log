'use client';

import { Button, Container, Input, Title } from '@/shared/components';
import { useSession, signIn } from 'next-auth/react';
import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Google from '@/public/assets/images/google.svg';
import Facebook from '@/public/assets/images/facebook.svg';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';

  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  return (
    <Container className="h-screen w-full w-max-[430px] px-10 flex flex-col justify-center items-center space-y-6">
      {/* Заголовок */}
      <div className="text-center mb-6">
        <Title text="Hey there," size="md" className="font-medium" />
        <Title text="Welcome back" size="xl" className="font-extrabold" />
      </div>

      {/* Поля ввода */}
      <div className="w-full space-y-4">
        {/* Email */}
        <div>
          <label className="text-base ml-4 text-muted font-medium block mb-1">E-mail address</label>
          <div className="relative">
            <Mail
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-accent"
              size={18}
              strokeWidth={2}
            />
            <Input
              type="email"
              placeholder="E-mail"
              className="pl-14 w-full bg-bgSurface py-5 border-none placeholder:text-primary"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-base ml-4 text-muted font-medium block mb-1">Password</label>
          <div className="relative">
            <Lock
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-accent"
              size={18}
              strokeWidth={2}
            />
            <Input
              type="password"
              placeholder="Password"
              className="pl-14 w-full bg-bgSurface py-5 border-none placeholder:text-primary"
            />
          </div>
        </div>

        {/* Forgot Password */}
        <a href="#" className="text-sm text-white hover:underline self-end block text-right">
          Forgot password?
        </a>
      </div>

      {/* Кнопка Sign In */}
      <Button
        variant="accent"
        size="accent"
        className="w-full text-white text-lg font-bold py-5 rounded-lg">
        Sign in
      </Button>

      {/* Разделитель */}
      <div className="flex items-center w-full my-2">
        <hr className="flex-1 border-muted" />
        <span className="mx-4 text-sm text-muted">Or</span>
        <hr className="flex-1 border-muted" />
      </div>

      {/* Кнопки входа через соцсети */}
      <div className="w-full space-y-2">
        <Button
          variant="secondary"
          className="w-full bg-white flex items-center text-bgBase font-bold py-5 min-h-16 rounded-full justify-center hover:bg-slate-200"
          onClick={() => signIn('google', { callbackUrl })}>
          <Image src={Google} alt="Google" width={24} height={24} className="mr-2" />
          Log in using Google
        </Button>
        <Button
          variant="secondary"
          className="w-full bg-white flex items-center text-bgBase font-bold py-5 min-h-16 rounded-full justify-center hover:bg-slate-200">
          <Image src={Facebook} alt="Facebook" width={26} height={26} className="mr-2" />
          Log in using Facebook
        </Button>
      </div>

      {/* Ссылка на регистрацию */}
      <p className="text-white mt-4 text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-bold underline">
          Sign up
        </Link>
      </p>
    </Container>
  );
}
