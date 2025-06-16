import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { FileImage } from 'lucide-react'

import { DetailArticle } from '@/types/responses/article_response_type'

type PropsArticleCard = {
  detail: DetailArticle
}

export function ArticleCard({ detail }: PropsArticleCard) {
  return (
    <Card className='h-full'>
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
      <CardContent className='space-y-2'>
        <Badge variant="secondary" className='truncate w-full'>
          {detail.category.name || '-'}
        </Badge>

        <h3 className='font-semibold text-lg capitalize line-clamp-2'>
          {detail.title || '-'}
        </h3>             
      </CardContent>
      <CardFooter>
        <Button asChild className='w-full'>
          <Link href={`/articles/${detail.id}?categoryId=${detail.categoryId}`}>
            Read More
          </Link>  
        </Button>      
      </CardFooter>
    </Card>
  )
}
