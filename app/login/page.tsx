"use client";

import { Button, Container, Title } from "@/shared/components";
import * as React from "react";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import Google from "@/public/assets/images/google.svg";
import { cn } from "@/lib/utils";
import { CornerRightDown } from "lucide-react";

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
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  return (
    <Container className="h-screen flex flex-col justify-center items-center px-9 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center text-center mb-4">
        <Title text="click here" size="sm" className="font-bold" />
        <CornerRightDown className="mt-5 ml-2" />
      </div>

      {/* Кнопка Sign In */}
      <Button
        className={cn(
          "w-full bg-white flex items-center text-base justify-center font-bold text-bgPrimary hover:bg-slate-50"
        )}
        variant={"accent"}
        size={"accent"}
        onClick={() => signIn("google", { callbackUrl })}
      >
        <Image src={Google} alt="Google" width={35} height={35} className="mr-2" />
        Sign in with Google
      </Button>
    </Container>
  );
}
