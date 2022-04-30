import React from 'react'
import { createClient } from 'contentful'
import Article from '../../../components/Article'
import {Container,Row, Col } from 'react-bootstrap'
import SideBar from '../../../components/SideBar'

//obtenemos los slugs de cada blog
export const getStaticPaths = async () => {
     //graphql
  const result = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_KEY} `,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          query:
          `query{
              allCategories:
            categoriasGluoCollection{
                items{
                slug,
                title
                }
            }
          }
          `
      }) 
  });
  const {data} = await result.json();
  const {items} = data.allCategories;

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

    //graphql
  const result = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_KEY} `,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          query:
          `query($slugCategory: String!){
              allCategories:
                categoriasGluoCollection{
                    items{
                        title,
                        slug
                    }
                }
              oneCategory:
                categoriasGluoCollection(where:{
                    slug: $slugCategory
                }){
                    items{
                    title,
                    }
                }
                 articlesCategory:
                    categoriasGluoCollection(where:{
                        slug_contains: $slugCategory
                    }, limit: 1){
                        items{
                        title,
                        linkedFrom{
                            blogGluoCollection(limit: 10){
                            items{
                                ...blogGluoFields
                            }
                            }
                        }
                        }
                    }
          }
          fragment blogGluoFields on BlogGluo{
              sys{
                  id
              },
            title,
            slug,
            thumbnail{
                url,
            }
            categoryCollection{
                items{
                title,
                slug

                }
            }
        }
          `,
          variables:{
              slugCategory: params.slug
          },
          
      }) 
  });


  const {data} = await result.json();
  const oneCategory = data.oneCategory.items[0];
  const allCategories = data.allCategories.items;
  const articles = data.articlesCategory.items[0].linkedFrom.blogGluoCollection.items;

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
