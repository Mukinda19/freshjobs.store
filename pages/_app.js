// pages/_app.js
import '@/styles/globals.css';
import Header from '@/components/Header';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Component {...pageProps} />
      </main>
    </>
  );
}
