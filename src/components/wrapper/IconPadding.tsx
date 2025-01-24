import { IconButton } from '@mui/material'
import { ReactNode } from 'react'

const IconPadding = ({ children }: {children: ReactNode}) => {
  return (
    <IconButton
      sx={{
        pointerEvents: 'none'
      }}
    >
      {children}
    </IconButton>
  )
}

export default IconPadding