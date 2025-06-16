import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function SkeletonCardArticle() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-44" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 mb-2" />
        <Skeleton className="h-4 mb-4" />
        <Skeleton className="h-12" />
      </CardContent>
    </Card>
  )
}
