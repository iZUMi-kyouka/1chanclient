'use client'
// ForwardRefEditor.tsx
import dynamic from 'next/dynamic'
import { forwardRef } from "react"
import { type MDXEditorMethods, type MDXEditorProps} from '@mdxeditor/editor'
import { useColorScheme } from '@mui/material'

// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import('./initialisedMDXEditor'), {
  // Make sure we turn SSR off
  ssr: false
})

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps & { darkTheme?: boolean, disableImage?: boolean}>((props, ref) => {
  const { colorScheme, setColorScheme } = useColorScheme();

  return <Editor darkMode={colorScheme === 'dark' ? true : false} {...props} editorRef={ref} />
})

// TS complains without the following line
ForwardRefEditor.displayName = 'ForwardRefEditor'