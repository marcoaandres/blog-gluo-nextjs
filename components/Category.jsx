import React from 'react'
import Link from 'next/link'

export default function Category({category}) {
    const {title, slug} = category;
    
  return (
    <div>
        <Link href={`/blog/category/${slug}`}>
            <a>{title}</a>
        </Link>
    </div>
  )
}
