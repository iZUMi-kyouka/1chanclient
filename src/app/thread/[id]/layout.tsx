import Sidebar from '@/components/sidebar'
import React, { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode}) => {
  return (
    <>
      <Sidebar />
      {children}
    </>
  )
}

export default layout