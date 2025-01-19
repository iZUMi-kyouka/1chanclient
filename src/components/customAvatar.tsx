import { Avatar } from '@mui/material'
import React from 'react'

const customAvatar = ({ username }: { username?: string }) => {
  return (
    <Avatar>
      {username}
    </Avatar>
  )
}

export default customAvatar