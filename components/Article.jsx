import Link from 'next/link'
import React from 'react'
import { Card, Button, Row, Col } from 'react-bootstrap'
import {Image} from 'next/image'

export default function Article({article}) {
  const {title, slug, thumbnail} = article
  return (
        <article>
          <Card style={{ width: '100%' }}>
          <Row>
              <Col sm={4}>
                <Card.Img variant="top" src={thumbnail.url} />
            </Col>
            <Col sm={8}>
              <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Link href={`/blog/${slug}`}>
                  <a>Conoce más</a>
                </Link>
            </Card.Body>
            </Col>
          </Row>
          </Card>
        </article>
  )
}
