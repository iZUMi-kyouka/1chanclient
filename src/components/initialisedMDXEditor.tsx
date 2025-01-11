'use client'
// InitializedMDXEditor.tsx
import type { ForwardedRef } from 'react'
import {
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  linkDialogPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  UndoRedo,
  imagePlugin,
  InsertImage,
  CreateLink,
  ListsToggle,
} from '@mdxeditor/editor'
import { BASE_API_URL, BASE_URL } from '@/app/layout';
import { customFetch } from '@/utils/customFetch';
import { InsertEmoticon, InsertLink } from '@mui/icons-material';

const handleImageUpload = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);
  try {
    const response = await fetch(`${BASE_API_URL}/upload/image`, {
      method: 'POST',
      body: formData
    })
  
    if (response.ok) {
      const imageURL = (await response.json()).url
      return imageURL
    }
  } catch (err: any) {
    throw new Error(`Failed to upload image: ${err}`)
  }
}

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        // Example Plugin Usage
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
            toolbarClassName: 'mdxeditorToolbar',
            toolbarContents: () => (
              <>
                {' '}
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <CreateLink />
                <ListsToggle />
                <InsertImage />
              </>
            )
          }),
        imagePlugin({
          imageUploadHandler: handleImageUpload,
        })
      ]}
      {...props}
      ref={editorRef}
    />
  )
}