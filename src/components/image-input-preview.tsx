'use client'

import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
interface ImageInputPreviewProps {
  onFileChange?: (file: File | null) => void
  onPreviewUrlChange?: (url: string | null) => void
}

export function ImageInputPreview({
  onFileChange,
  onPreviewUrlChange,
}: ImageInputPreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isUserInteracted = useRef(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (isUserInteracted.current) {
      onFileChange?.(file)
    }
  }, [file, onFileChange])

  useEffect(() => {
    if (isUserInteracted.current) {
      onPreviewUrlChange?.(previewUrl)
    }
  }, [previewUrl, onPreviewUrlChange])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserInteracted.current = true
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setFile(null)
      setPreviewUrl(null)
    }
  }

  const handleReset = () => {
    isUserInteracted.current = true
    setFile(null)
    setPreviewUrl(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="image">Upload Image</Label>
      <Input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={inputRef}
        className="hidden"
      />

      {previewUrl && (
        <div className="relative w-64 h-64 border rounded overflow-hidden">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            loader={({ src }) => src}
            unoptimized
            className="object-contain"
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          variant="outline"
        >
          Choose File
        </Button>

        {previewUrl && (
          <Button
            type="button"
            onClick={handleReset}
            variant="destructive"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
