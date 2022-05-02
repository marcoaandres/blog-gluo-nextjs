import React from 'react'
import { createClient } from 'contentful'
import Article from '@components/Article'
import {Container,Row, Col } from 'react-bootstrap'
import SideBar from '@components/SideBar'
import Api from '@utils/Api'
import Pagination from '@components/Pagination'
import { Config } from '@utils/Config'
import Layout from '@components/Layout'

//obtenemos los slugs de cada blog
export async function getStaticPaths() {
    const data = await Api.getAllCategories();
    
    const {items} = data;

    const paths = items.map( item=>{
        return{
            params: {slug: item.slug}
        }
    })
    console.log("Categories")
    console.log(paths);
    return{
        paths,
        //false -> si no encuenttra la pagina, regres un 404
        //true -> regresa otra pagina 
        fallback: true,
    }
}
//obtenemos las propiedades de la categoria que queremos ver y los articulos de esta categoria
export async function getStaticProps({params}){
    // console.log(params.slug);
  const data = await Api.getItemsCategory(params.slug, 1);

//   console.log(data);

  const oneCategory = data.oneCategory.items[0];
  const allCategories = data.allCategories.items;
  const articles = data.articleCollection.items[0].linkedFrom.blogGluoCollection.items;
  const totalArticles = data.articleCollection.items[0].linkedFrom.blogGluoCollection.total;
  console.log(oneCategory);
  const totalPages = Math.ceil(totalArticles / Config.pagination.pageSize);

//   if(!oneCategory || !articles.length || !articles ){
//         return {
//             redirect:{
//                 destination: '/blog',
//                 permanent: false,
//             }
//         };
//     }
    return{
        props: { 
                oneCategory,
                allCategories,
                articles,
                totalPages,
                currentPage: "1",
            },
        revalidate: 1
    }
}

export default function Category({oneCategory, allCategories, articles, currentPage, totalPages}) {
    const nextDisabled = parseInt(currentPage, 10) === parseInt(totalPages, 10);
  const prevDisabled = parseInt(currentPage, 10) === 1;
  return (
        <Layout
        titlePage={oneCategory.title}
        metaDescription="Descripción de mi categoria"
        metakeywords="gluo, blog, México, 2022"
        >
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
                <Pagination
                totalPages={totalPages} 
                currentPage={currentPage} 
                prevDisabled={prevDisabled}
                nextDisabled={nextDisabled}
                category={oneCategory.slug}
                />
              </section>
        </Layout>
          
  )
}
