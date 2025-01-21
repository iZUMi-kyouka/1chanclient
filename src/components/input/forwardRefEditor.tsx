'use client'

import { type MDXEditorMethods, type MDXEditorProps } from '@mdxeditor/editor'
import { useColorScheme } from '@mui/material'
import dynamic from 'next/dynamic'
import { forwardRef } from "react"

// Import InitializedMDXEditor directly (do not do this anywhere else)
const Editor = dynamic(() => import('./initialisedMDXEditor'), {
  // SSR must be off
  ssr: false
})

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps & { darkTheme?: boolean, disableImage?: boolean}>((props, ref) => {
  const { colorScheme } = useColorScheme();

  return <Editor darkMode={colorScheme === 'dark' ? true : false} {...props} editorRef={ref} />
})

ForwardRefEditor.displayName = 'ForwardRefEditor'