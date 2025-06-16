import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { DetailArticle } from '@/types/responses/article_response_type'
import { formatDateTime, getInitialAvatar } from '@/lib/utils'

import { FileImage } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'

type ArticleCardProps = {
  detail: DetailArticle
}

export function ArticleCard({ detail }: ArticleCardProps) {
  const router = useRouter()
  return (
    <Card className='h-full hover:cursor-pointer' onClick={() => router.push(`/articles/${detail.id}?categoryId=${detail.categoryId}`)}>
      <CardHeader>
        <div className='w-full h-44 bg-muted-foreground flex items-center justify-center rounded-lg'>
          {
            detail.imageUrl ? (
              <Image 
                src={detail.imageUrl} 
                loader={({ src }) => src} 
                unoptimized alt='image'
                width='100'
                height='176'
                className='rounded-lg object-cover w-full h-44' 
              />
            ) : (
              <FileImage />
            )
          }
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <Badge variant="secondary" className="whitespace-normal leading-normal break-words line-clamp-1">
          {detail.category.name}
        </Badge>

        <h2 className="text-lg font-semibold line-clamp-2">{detail.title}</h2>
          
        <article className="prose prose-lg max-w-none text-muted-foreground line-clamp-3">
          <div dangerouslySetInnerHTML={{ __html: detail.content! }} />
        </article>
      </CardContent>

      <CardFooter className='flex flex-col justify-end items-start h-full space-y-2'>
        <div className='flex items-center gap-x-2'>
          <Avatar>
            <AvatarFallback>
              {getInitialAvatar(detail.user.username)}
            </AvatarFallback>
          </Avatar>
          
          <span className='text-sm font-medium'>{detail.user.username}</span>
        </div>

        <div className='text-xs text-muted-foreground'>
          {formatDateTime(detail.createdAt)}
        </div>
      </CardFooter>
    </Card>
  )
}
