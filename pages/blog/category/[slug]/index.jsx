import React from 'react'
import { createClient } from 'contentful'
import Article from '@components/Article'
import {Container,Row, Col } from 'react-bootstrap'
import SideBar from '@components/SideBar'
import Api from '@utils/Api'
import Pagination from '@components/Pagination'

//obtenemos los slugs de cada blog
export async function getStaticPaths() {
    const data = await Api.getAllCategories();
    
    const {items} = data;

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
//obtenemos las propiedades de la categoria que queremos ver y los articulos de esta categoria
export async function getStaticProps({params}){
    console.log(params.slug);
  const data = await Api.getItemsCategory(params.slug, 1);

  console.log(data);

  const oneCategory = data.oneCategory.items[0];
  const allCategories = data.allCategories.items;
  const articles = data.articleCollection.items[0].linkedFrom.blogGluoCollection.items;

  if(!oneCategory || !articles.length || !articles ){
        return {
            redirect:{
                destination: '/blog',
                permanent: false,
            }
        };
    }
    return{
        props: { 
                oneCategory,
                allCategories,
                articles,
            },
        revalidate: 1
    }
}

export default function Category({oneCategory, allCategories, articles}) {
  return (
        <section>
            <Container>
                <Row>
                    <Col sm={4}>
                        <aside>
                            <SideBar categories={allCategories} />
                        </aside>
                    </Col>
                    <Col sm={8}>
                        <h1>Categoría: {oneCategory.title}</h1>
                        <Row>
                            {
                                articles.map(article => (
                                    <Col md={12} key={article.sys.id}>
                                        <Article article={article} />
                                    </Col>
                                ))
                            }
                        </Row>
                    </Col>
                </Row>
            </Container>
          </section>
  )
}
