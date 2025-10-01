import Header from "./Header"
import Footer from "./Footer"

export default function Layout({ children }) {
  return (
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
  )
}
