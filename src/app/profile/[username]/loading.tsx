import FullPageSpinner from '@/components/fullPageLoading'
import WrappedLoading from '@/components/wrappedLoading'
import { CircularProgress } from '@mui/material'
import React from 'react'

const loading = () => {
  return (
    <FullPageSpinner />
  )
}

export default loading