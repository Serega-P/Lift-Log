"use client";

import { Button, Container, Title } from "@/components/shared/components";
import * as React from "react";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import Google from "@/public/assets/images/google.svg";
import { cn } from "@/lib/utils";

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
      <div className="text-center space-y-1 mb-12">
        <Title text="Log in" size="lg" className="font-extrabold" />
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




// "use client";

// import { Button, Container, Title } from "@/components/shared/components";
// import * as React from "react";
// import { useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useSession, signIn } from "next-auth/react";
// import Image from 'next/image';
// import Google from "@/public/assets/images/google.svg";
// import { cn } from "@/lib/utils";

// export default function LoginPage() {
// 	const { data: session } = useSession();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") || "/";

// 	useEffect(() => {
//     if (session) {
//       router.push(callbackUrl);
//     }
//   }, [session, router, callbackUrl]);

//   return (
//     <Container className="h-screen flex flex-col justify-center items-center px-9 space-y-6">
//       {/* Заголовки */}
//       <div className="text-center space-y-1 mb-12">
//         {/* <span className="text-2xl font-medium">Hey there,</span> */}
//         <Title text="Log in" size="lg" className="font-extrabold" />
//       </div>

//       {/* Кнопка Sign In */}
//       <Button
//         className={cn("w-full bg-white flex items-center text-base justify-center font-bold text-bgPrimary hover:bg-slate-50")}
// 				variant={"accent"}
// 				size={"accent"}
// 				onClick={() => 
// 					signIn('google', {callbackUrl} )
// 				}
// 				>
// 				<Image 
//           src={Google} 
//           alt="Google" 
//           width={35} 
//           height={35} 
//           className="mr-2"
//         />
//         Sign in with Google
//       </Button>
//     </Container>
//   );
// }