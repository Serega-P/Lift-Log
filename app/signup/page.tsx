'use client';

import { Button, Container, Input, Title } from '@/shared/components';
import Link from 'next/link';
import { Lock, Mail, User } from 'lucide-react';

export default function SignUpPage() {
  return (
    <Container className="h-screen w-full max-w-[430px] px-10 flex flex-col justify-center items-center space-y-6">
      {/* Заголовок */}
      <div className="text-center mb-6">
        <Title text="Hi!" size="xl" className="font-extrabold" />
        <Title text="Create a new account" size="md" className="font-medium" />
      </div>

      {/* Поля ввода */}
      <div className="w-full space-y-4">
        {/* Name */}
        <div>
          <label className="text-base ml-4 text-muted font-medium block mb-1">Your Name</label>
          <div className="relative">
            <User
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-accent"
              size={18}
            />
            <Input
              type="text"
              placeholder="Name"
              className="pl-14 w-full bg-bgSurface py-5 border-none placeholder:text-primary"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-base ml-4 text-muted font-medium block mb-1">E-mail address</label>
          <div className="relative">
            <Mail
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-accent"
              size={18}
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
            />
            <Input
              type="password"
              placeholder="Password"
              className="pl-14 w-full bg-bgSurface py-5 border-none placeholder:text-primary"
            />
          </div>
        </div>
      </div>

      {/* Кнопка Sign Up */}
      <Button
        variant="accent"
        size="accent"
        className="w-full text-white text-lg font-bold py-5 rounded-lg">
        Sign up
      </Button>

      {/* Ссылка на вход */}
      <p className="text-white mt-4 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="font-bold underline">
          Sign in
        </Link>
      </p>
    </Container>
  );
}
