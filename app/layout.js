import Navbar from './components/Navbar'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_b25lLWFuY2hvdnktNzUuY2xlcmsuYWNjb3VudHMuZGV2JA"

export const metadata = {
  title: 'QuickAI', 
  description: 'Powerful AI Tools',
  icons: {
    icon: '/assets/favicon.svg', 
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning className="antialiased" style={{ backgroundColor: '#000', color: '#fff' }}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}