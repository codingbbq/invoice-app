'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

const DISMISS_KEY = 'invoice-app-install-banner-dismissed';

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (typeof navigator !== 'undefined' && 'standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

    if (isStandalone) {
      setIsVisible(false);
      return;
    }

    const isDismissed = window.localStorage.getItem(DISMISS_KEY) === 'true';

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(!isDismissed);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
      window.localStorage.removeItem(DISMISS_KEY);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);

    if (outcome === 'accepted') {
      window.localStorage.removeItem(DISMISS_KEY);
    }

    setIsVisible(false);
  };

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] sm:inset-x-auto sm:right-4 sm:w-full sm:max-w-md">
      <div className="rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-[0_20px_40px_-20px_rgba(37,99,235,0.45)] backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Download className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Install Invoice App</h3>
            <p className="mt-1 text-sm text-gray-600">
              Add this app to your phone for faster access from your home screen.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Button onClick={handleInstall} size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Install App
              </Button>
              <Button onClick={handleDismiss} variant="ghost" size="sm">
                Not now
              </Button>
            </div>
          </div>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="icon-sm"
            className="-mr-1 -mt-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
