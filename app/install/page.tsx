"use client";

import { useEffect, useState } from "react";
import { Title, Button } from "@/components/shared/components";
import { Download } from "lucide-react";

// Интерфейсы для событий установки
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

// Расширяем `Navigator` для добавления свойства standalone
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [installing, setInstalling] = useState<boolean>(false);

  useEffect(() => {
    // Проверяем, установлено ли приложение
    const checkPWAInstalled = () => {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        Boolean((navigator as NavigatorWithStandalone).standalone)
      );
    };

    // Устанавливаем состояние на основе того, установлено ли приложение
    setIsInstalled(checkPWAInstalled());

    // Ловим событие установки PWA (если оно доступно)
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Функция установки PWA
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    setInstalling(true);

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true); // После установки приложение считается установленным
    }
    setInstalling(false);
  };

  return (
    <div className="flex items-center justify-center flex-col px-10 w-full max-w-[420px] h-screen bg-slate-5">
      <Title
        text="Track progress effortlessly"
        size="xl"
        className="font-extrabold text-center leading-tight text-[42px]"
      />
      <Title text="Log workouts, monitor loads and improve results." size="sm" className="font-normal text-center" />
      
      {isInstalled ? (
        <Title text="Installation complete!" size="sm" className="font-extrabold text-center mt-10" />
      ) : (
        <>
          {installing ? (
            <Title text="Installing..." size="sm" className="font-extrabold text-center mt-10" />
          ) : (
            <Button
              onClick={handleInstall}
              className="bg-blue-500 rounded-lg mt-10"
              variant="accent"
              size="default"
            >
              <Download />
              Install
            </Button>
          )}
        </>
      )}
    </div>
  );
}
