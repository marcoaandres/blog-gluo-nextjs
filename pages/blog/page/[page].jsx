import React from 'react'
import Api from '@utils/Api'
import { Config } from '@utils/Config'
import { Col, Container, Row } from "react-bootstrap"
import Article from "@components/Article"
import Layout from "@components/Layout"
import SideBar from "@components/SideBar"
import Pagination from '@components/Pagination'

export async function getStaticPaths(){
  const totalArticles = await Api.getTotalPostsNumber();
  const totalPages = Math.ceil(totalArticles / Config.pagination.pageSize);

  const paths = [];
// console.log(paths);
  //definimos la lista de rutas a representar al momento de la compilacion
  for (let page = 2; page <= totalPages; page++) {
    paths.push({ params: { page: page.toString() } });
  }

  return{
    paths,
    fallback: false,
  }
}

//Indicamos que ruta queremos representar
export async function getStaticProps({ params }) {
  console.log("page");
  console.log(params);
  const data = await Api.getPaginatedPost(params.page);
  
  const allCategories = data.allCategories.items;
  const articles = data.articleCollection.items;
  const totalArticles = data.articleCollection.total;
  const totalPages = Math.ceil(totalArticles / Config.pagination.pageSize);

  return {
    props: {
      allCategories,
      articles,
      totalPages,
      currentPage: params.page,
    },
  }
}

export default function IndexPage({allCategories, articles, totalPages, currentPage}) {
  const nextDisabled = parseInt(currentPage, 10) === parseInt(totalPages, 10);
  const prevDisabled = parseInt(currentPage, 10) === 1;
  return (
    <Layout
    titlePage="Blog"
    metaDescription="Descripción de mi página de blog"
    metakeywords="gluo, blog, México, 2022"
    >
      <h1>Blog</h1>
      <section>
        <Container>
            <Row>
                <Col sm={4}>
                    <aside>
                        <SideBar categories={allCategories} />
                    </aside>
                </Col>
                <Col sm={8}>
                    <h2>Últimos artículos</h2>
                    <Row>
                        {
                        articles.map(article=>(
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
             />
      </section>
    </Layout>
  )
}
