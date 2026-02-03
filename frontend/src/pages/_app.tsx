import type { AppProps } from 'next/app';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import '../styles/globals.css';

const manifestUrl = 'https://ton-agent-personhood.vercel.app/tonconnect-manifest.json';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              🦞 TON Agentic Personhood
            </h1>
            <p className="text-gray-600">
              Foundational infrastructure for AI agent rights and legal recognition
            </p>
          </div>
        </header>
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </TonConnectUIProvider>
  );
}
