import { createClient } from 'contentful'
import React from 'react'
import Image from 'next/image'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Container, Row, Col } from 'react-bootstrap'
import Layout from '../../components/Layout'

const client = createClient({
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
    space: process.env.CONTENTFUL_SPACE_ID
})

//obtenemos los slugs de cada blog
export const getStaticPaths = async () => {
    const res = await client.getEntries({ 
        content_type: 'blogGluo'
    })

    const paths = res.items.map( item=>{
        return{
            params: {slug: item.fields.slug}
        }
    })

    return{
        paths,
        fallback: false,
    }
}

//obtenemos las propiedades del blog que queremos ver
export async function getStaticProps({params}){
    const {items} = await client.getEntries({
        content_type: 'blogGluo',
        'fields.slug': params.slug
    })

    return{
        props: {article: items[0]},

        //Regeneracion estatica incremental
        //Una vez cargado el contenido esperamos como maximo 1s para acceder al contenido en servidor
        // y verificar si hay cambios 
        revalidate: 1
    }

}


export default function Article({article}) {
    const {author, creationDate, excerpt, title, body, thumbnail, metaDescription, metaKeywords} = article.fields;
    const authorFullname = author.fields.fullName;
    console.log(article)
  return (
        <Layout
        titlePage={title}
        metaDescription={metaDescription}
        metakeywords={metaKeywords}
        >
            <Container>
                <Row>
                    <Col sm={4}>
                        <aside>
                            <h2>Categorias</h2>
                        </aside>
                    </Col>
                    <Col sm={8}>
                        <article>
                            <Image src={`https:${thumbnail.fields.file.url}`} alt={title}
                            width={thumbnail.fields.file.details.image.width} 
                            height={thumbnail.fields.file.details.image.height} 
                            />
                            <h1>{title}</h1>
                            <span>{creationDate} | {authorFullname}  </span>
                            <p>{excerpt}</p>
                            <div>
                                {
                                    documentToReactComponents(body)
                                }
                            </div>
                        </article>
                    </Col>
                </Row>
            </Container>
        </Layout>
  )
}
