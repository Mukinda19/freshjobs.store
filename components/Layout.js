import Head from "next/head"
import Header from "./Header"
import Footer from "./Footer"

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://www.freshjobs.store/"
        />
      </Head>

      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-grow container mx-auto px-6 py-8">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}