import type { Metadata } from 'next';
import './globals.css';
import { ShoppingProvider } from '@/context/ShoppingContext';
import { ProductProvider } from '@/context/ProductContext';
import { VoiceProvider } from '@/context/VoiceContext';
import { Header } from '@/components/layout/Header';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { VoiceModal } from '@/components/voice/VoiceModal';
import { CommandFeedbackToast } from '@/components/voice/CommandFeedbackToast';

export const metadata: Metadata = {
  title: 'VoiceCart — Voice Command Shopping Assistant',
  description: 'Just say what you need. A voice-first intelligent grocery shopping assistant with multi-item parsing, smart replenishment recommendations, and product discovery.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-stone-100/70 text-stone-900 font-sans antialiased selection:bg-emerald-500 selection:text-white flex flex-col">
        <ShoppingProvider>
          <ProductProvider>
            <VoiceProvider>
              <DemoBanner />
              <Header />

              <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 md:pb-6">
                <DesktopSidebar />
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-5xl w-full mx-auto overflow-y-auto">
                  {children}
                </main>
              </div>

              <MobileNav />
              <VoiceModal />
              <CommandFeedbackToast />
            </VoiceProvider>
          </ProductProvider>
        </ShoppingProvider>
      </body>
    </html>
  );
}
