import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Calculator App',
    description: 'Calculator Practice App created in Next.js',
}

export default function RootLayout({ children, }: {
    children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body className={inter.className}>{children}</body>
    </html>
  )
}
