'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-128px)] items-center justify-center p-4">
       <Card className="w-full max-w-lg text-center">
            <CardHeader>
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Search className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4 text-4xl">404 - Page Not Found</CardTitle>
                <CardDescription>
                   The page you are looking for does not exist. It might have been moved or deleted.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/">
                        Return to Homepage
                    </Link>
                </Button>
            </CardContent>
       </Card>
    </div>
  )
}
