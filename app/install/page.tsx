'use client';

import { useEffect, useState } from 'react';
import { Title, Button } from '@/shared/components';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [installing, setInstalling] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    const checkPWAInstalled = () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        Boolean((navigator as NavigatorWithStandalone).standalone)
      );
    };

    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(userAgent.includes('iphone') || userAgent.includes('ipad'));
    setIsInstalled(checkPWAInstalled());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      setInstalling(true);
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
      }

      setInstalling(false);
    } else {
      alert('Install option is not available on this device.');
    }
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center px-10">
      {/* Фон */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/images/install-bg.jpg)' }}
      />

      {/* Оверлей 85% */}
      <div className="absolute inset-0 bg-bgPrimary/90" />

      {/* Контент поверх */}
      <div className="relative z-10 flex flex-col items-center text-white">
        <Title
          text="Workout Log"
          size="xl"
          className="font-extrabold text-center leading-tight text-[42px]"
        />
        <Title
          text="Log workouts, monitor loads and improve results."
          size="sm"
          className="font-normal text-center"
        />

        {isInstalled ? (
          <Title
            text="Installation complete!"
            size="sm"
            className="font-extrabold text-center mt-10"
          />
        ) : (
          <>
            {installing ? (
              <Title text="Installing..." size="sm" className="font-extrabold text-center mt-10" />
            ) : (
              <Button
                onClick={handleInstall}
                className="bg-green-500 text-lg px-12 mt-10"
                variant="accent"
                size="accent">
                <Download size={20} />
                Install
              </Button>
            )}

            {isIOS && !deferredPrompt && (
              <Title
                text="To install, tap 'Add to Home Screen' from your browser's menu."
                size="xs"
                className="font-light italic text-center mt-10"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
