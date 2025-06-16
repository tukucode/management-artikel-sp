import Image from 'next/image'
import { FileImage } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ConditionalView, If, Else } from '@/components/conditional-view'

import { formatDateTime, getInitialAvatar } from '@/lib/utils'
import { PreviewDataArticle } from '@/types/responses/article_response_type'

export function ArticlePreview({ 
  title,
  content,
  username,
  createdAt,
  imageUrl,
} : PreviewDataArticle) {
  return (
    <>
      <h1 className='text-2xl md:text-4xl font-bold capitalize text-center'>
        {title}
      </h1>

      <div className='flex items-center gap-x-2'>
        <div className='flex items-center gap-x-2'>
          <Avatar>
            <AvatarFallback>
              {getInitialAvatar(username)}
            </AvatarFallback>
          </Avatar>
          
          <span className='text-sm font-medium'>{username}</span> 
        </div>
        {'-'}
        <p className='text-xs text-muted-foreground'>
          {formatDateTime(createdAt!)}
        </p>
      </div>

      <div className='w-full h-[300px] md:h-[600px] bg-muted-foreground flex items-center justify-center rounded-lg mt-6 mb-4'>
        <ConditionalView condition={[!!imageUrl]}>
          <If>
            <Image 
              src={imageUrl!} 
              loader={({ src }) => src} 
              unoptimized 
              alt={imageUrl!}
              width='150'
              height='300'
              className='object-cover rounded-lg w-full h-full' 
            /> 
          </If>

          <Else>
            <FileImage className='w-8 md:w-20 h-8 md:h-20' />
          </Else>
        </ConditionalView>
      </div>

      <article className="prose prose-lg mt-6 max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content! }} />
      </article>
    </>
  )
}
