import { createClient } from 'contentful'
import React from 'react'
import Image from 'next/image'
import { Container, Row, Col } from 'react-bootstrap'
import Layout from '../../components/Layout'
import SideBar from "../../components/SideBar"
import BodyArticle from '../../components/BodyArticle'
import Api from '@utils/Api'

//obtenemos los slugs de cada blog
export async function getStaticPaths(){
const allPostsSlug = await Api.getAllPostsSlug();
const {items} = allPostsSlug;

    const paths = items.map( item=>{
        return{
            params: {slug: item.slug}
        }
    })

    return{
        paths,
        //false -> si no encuenttra la pagina, regres un 404
        //true -> regresa otra pagina 
        fallback: true,
    }
}

//obtenemos las propiedades del blog que queremos ver
export async function getStaticProps({ params }){
    const data = await Api.getOnePost(params.slug);
    const oneArticle = data.items[0];

    if(!oneArticle){
        return {
            redirect:{
                destination: '/blog',
                permanent: false,
            }
        };
    }

    // const allCategories = data.allCategories.items;
    return{
        props: { 
                oneArticle,
                // allCategories
            },

        //Regeneracion estatica incremental
        //Una vez cargado el contenido esperamos como maximo 1s para acceder al contenido en servidor
        // y verificar si hay cambios 
        revalidate: 1
    }

}


export default function Article({oneArticle, allCategories}) {
    //si no hay articulo, presentamos el loadign mientras en segundo plano se vuelve a hacer la consulta
    if(!oneArticle) return <div>Loading...</div>
    // ^ podria ser un ocmopoente skeleton que nos de la impresion que el articulo esta cargando

    const {author, creationDate, excerpt, title, body, thumbnail, metaDescription, metaKeywords} = oneArticle;
    const authorFullname = author.fullName;
    // console.log(article)
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
                            {/* <SideBar categories={allCategories} /> */}
                        </aside>
                    </Col>
                    <Col sm={8}>
                        <article>
                            <Image src={thumbnail.url} alt={title}
                            width={300} 
                            height={300} 
                            />
                            <h1>{title}</h1>
                            <span>{creationDate} | {authorFullname}  </span>
                            <p>{excerpt}</p>

                            <BodyArticle body={body}/>
                        </article>
                    </Col>
                </Row>
            </Container>
        </Layout>
  )
}
