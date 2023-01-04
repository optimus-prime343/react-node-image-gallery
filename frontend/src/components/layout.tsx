import Head from 'next/head'
import { ReactNode } from 'react'

export interface LayoutProps {
  title: string
  children: ReactNode
}
export const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <meta name='description' content='Upload and share your images' />
        <title>{title}</title>
      </Head>
      {children}
    </>
  )
}
