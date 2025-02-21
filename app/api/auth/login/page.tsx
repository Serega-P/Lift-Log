"use client";

import { Button, Container, Title, Input } from "@/components/shared/components";
import * as React from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  return (
    <Container className="h-screen flex flex-col justify-center items-center px-9 space-y-6">
      {/* Заголовки */}
      <div className="text-center space-y-1 mb-12">
        <span className="text-2xl font-medium">Hey there,</span>
        <Title text="Welcome back" size="lg" className="font-extrabold" />
      </div>

      {/* Поле E-mail */}
      <div className="w-full space-y-1">
        <label htmlFor="email" className="block font-medium text-base text-muted pl-3">
          E-mail address
        </label>
        <div className="relative">
          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-accentSoft" strokeWidth={3} size={18} />
          <Input
            id="email"
            type="email"
            placeholder="E-mail"
            className="pl-14 bg-bgSurface border-transparent placeholder:text-primary font-bold"
          />
        </div>
      </div>

      {/* Поле Password */}
      <div className="w-full space-y-1">
        <label htmlFor="password" className="block font-medium text-base text-muted pl-3">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-accentSoft" strokeWidth={3} size={18} />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            className="pl-14 bg-bgSurface border-transparent placeholder:text-primary font-bold"
          />
        </div>
      </div>

      {/* Ссылка "Forgot password?" */}
      <div className="w-full text-right">
        <a href="#" className="text-sm font-medium hover:underline">
          Forgot password?
        </a>
      </div>

      {/* Кнопка Sign In */}
      <Button
        className={cn("w-full flex items-center text-base justify-center font-bold")}
				variant={"accent"}
				size={"accent"}
				>
        <LogIn strokeWidth={3} className="mr-0.5 text-white" size={20} />
        Sign in
      </Button>
    </Container>
  );
}




// "use client"

// import { 
// 	Button,
// 	Container,
// 	Title,
// 	Input,
//  } from "@/components/shared/components";
// import * as React from "react";
// import { Plus } from "lucide-react";
// import { cn } from "@/lib/utils";

// export default function Login() {
//   return (
// 		<>
// 			<Container className="h-screen flex flex-col flex-wrap items-center justify-center px-9">
// 				<span className="text-2xl font-medium">Hey there,</span>
// 				<Title text='Welcome back' size='lg' className="font-extrabold"/>
// 				<span className="inline-block w-full font-medium pl-[10px] font-[15px] text-muted">E-mail address</span>
// 				<Input 
// 					type="email" 
// 					placeholder="Email" 
// 					className="placeholder:text-primary"/>
// 					<Button
// 						 className={cn("w-full h-[88px] flex items-center justify-center border-2 border-dashed border-muted bg-soft text-base text-bold text-muted rounded-2xl hover:bg-gray-200")}>
// 						 <Plus strokeWidth={2} size={20} className="text-muted" /> Add Workout Day
// 					</Button>
// 			</Container>
// 		</>
//   )
// }
