/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import {
  Bold, Italic, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, UnderlineIcon,
} from 'lucide-react'
import { JSX, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import StarterKit from '@tiptap/starter-kit'
import Heading, { Level } from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'

// Constants
const HEADING_CLASSES: Record<Level, string> = {
  1: 'text-4xl', 2: 'text-3xl', 3: 'text-2xl',
  4: 'text-xl', 5: 'text-lg', 6: 'text-base',
}
const TEXT_ALIGN_OPTIONS = ['left', 'center', 'right', 'justify'] as const
type AlignType = (typeof TEXT_ALIGN_OPTIONS)[number]

interface TextEditorProps {
  isError: boolean
  value?: string
  onChange?: (html: string) => void
}

export const TextEditor: React.FC<TextEditorProps> = ({ isError, value = '', onChange }) => {
  const inputImageRef = useRef<HTMLInputElement>(null)
  const [textAlign, setTextAlign] = useState<AlignType>('left')
  const [textLevelSelected, setTextLevelSelected] = useState<number | 'paragraph'>('paragraph')

  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: { HTMLAttributes: { class: 'list-disc ml-6' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal ml-6' } },
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }).extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = node.attrs.level as Level
          return [
            `h${level}`,
            {
              ...HTMLAttributes,
              class: `font-bold ${HEADING_CLASSES[level]}`,
            },
            0,
          ]
        },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline, Subscript, Superscript, Highlight,
      Image.configure({ inline: true }),
    ],
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    onSelectionUpdate: ({ editor }) => {
      if (editor?.isActive('heading')) {
        for (let level = 1; level <= 6; level++) {
          if (editor.isActive('heading', { level })) {
            setTextLevelSelected(level)
          }
        }
      } else {
        setTextLevelSelected('paragraph')
      }

      TEXT_ALIGN_OPTIONS.forEach((align) => {
        if (editor.isActive({ textAlign: align })) {
          setTextAlign(align)
        }
      })
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none p-4',
        style: 'min-height: 400px',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false)
    }
  }, [value, editor])

  const handleUploadImage = () => inputImageRef.current?.click()

  const onCreateFileToURL = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(URL.createObjectURL(file)), 1000)
    })
  }

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isAllowed = ['jpg', 'jpeg', 'png'].some((type) => file.type.toLowerCase().includes(type))
    if (!isAllowed) {
      alert('Only jpg, jpeg, png files are allowed')
      return
    }

    if (!window.confirm('Are you sure you want to upload this image?')) return

    try {
      const imageUrl = await onCreateFileToURL(file)
      editor?.chain().setImage({ src: imageUrl }).run()
    } catch (error) {
      console.error(error)
      alert('Error uploading image')
    }

    e.target.value = ''
  }

  if (!editor) return <div className="p-4 text-center">Loading editor...</div>

  const renderButton = (
    icon: JSX.Element,
    command: () => void,
    isActive: boolean,
    title: string,
  ) => (
    <button
      type="button"
      className={cn('editor-btn', isActive && 'is-active')}
      onClick={command}
      title={title}
    >
      {icon}
    </button>
  )

  return (
    <div className="w-full mx-auto">
      <div className="border bg-gray-100 dark:bg-card rounded-t-lg px-3 py-2 flex gap-4 items-center flex-wrap">
        {renderButton(<Bold className="w-4 h-4" />, () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'Bold')}
        {renderButton(<Italic className="w-4 h-4" />, () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'Italic')}
        {renderButton(<UnderlineIcon className="w-4 h-4" />, () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'), 'Underline')}
        {renderButton(<AlignLeft className="w-4 h-4" />, () => editor.chain().focus().setTextAlign('left').run(), textAlign === 'left', 'Align Left')}
        {renderButton(<AlignCenter className="w-4 h-4" />, () => editor.chain().focus().setTextAlign('center').run(), textAlign === 'center', 'Align Center')}
        {renderButton(<AlignRight className="w-4 h-4" />, () => editor.chain().focus().setTextAlign('right').run(), textAlign === 'right', 'Align Right')}
        {renderButton(<ImageIcon className="w-4 h-4" />, handleUploadImage, false, 'Insert Image')}
        <input
          ref={inputImageRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          className="hidden"
          onChange={handleChangeImage}
        />
      </div>

      <div className={cn(
        'border dark:bg-input/30 rounded-b-lg min-h-[300px] focus-visible:outline-none',
        isError && 'border-destructive',
      )}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
