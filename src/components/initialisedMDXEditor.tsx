'use client'
// InitializedMDXEditor.tsx
import type { ForwardedRef } from 'react'
import {
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
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
  codeBlockPlugin,
  InsertCodeBlock,
  sandpackPlugin,
  codeMirrorPlugin,
  SandpackConfig,
  InsertTable
} from '@mdxeditor/editor'
import { BASE_API_URL, BASE_URL } from '@/app/layout';
import { customFetch } from '@/utils/customFetch';
import { DarkMode, InsertEmoticon, InsertLink } from '@mui/icons-material';

const handleImageUpload = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);
  try {
    const response = await fetch(`${BASE_API_URL}/upload/image`, {
      method: 'POST',
      body: formData
    });
  
    if (response.ok) {
      const imageURL = (await response.json()).url;
      return imageURL;
    } else if (response.status === 400) {
      throw new Error("uploaded image is invalid.");
    }
  } catch (err: any) {
    throw new Error(`Failed to upload image: ${err}`)
  }
}

const simpleSandpackConfig: SandpackConfig = {
  defaultPreset: 'react',
  presets: [
    {
      label: 'React',
      name: 'react',
      meta: 'live react',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: ''
    },
  ]
}


// Only import this to the next file
export default function InitializedMDXEditor({
  darkMode,
  disableImage,
  editorRef,
  ...props
}: { darkMode?: boolean, disableImage?: boolean, editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      className={`${darkMode ? 'dark-theme dark-editor' : ''}`}
      plugins={[
        // Example Plugin Usage
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkPlugin(),
        tablePlugin(),
        linkDialogPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js'}),
        sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
        codeMirrorPlugin({ codeBlockLanguages: {  html: 'HTML', css: 'CSS', js: 'JavaScript', ts: 'TypeScript', jsx: 'JSX', tsx: 'TSX', rust: 'Rust', c: 'C', cpp: 'C++', python: 'Python' } }),
        toolbarPlugin({
            toolbarClassName: 'mdxeditorToolbar',
            toolbarContents: () => (
              <>
                {' '}
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <CreateLink />
                <ListsToggle options={['bullet', 'number']}/>
                <InsertTable />
                <InsertCodeBlock />
                { disableImage ? <></> : <InsertImage />}
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