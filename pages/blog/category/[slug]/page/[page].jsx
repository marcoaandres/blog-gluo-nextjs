import Article from '@components/Article'
import Layout from '@components/Layout'
import Pagination from '@components/Pagination'
import SideBar from '@components/SideBar'
import Api from '@utils/Api'
import { Config } from '@utils/Config'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

export async function getStaticPaths(){
  
    const category = Config.category.slug;
    const totalArticles = await Api.getTotalPostsNumber(category);
    const totalPages = Math.ceil(totalArticles / Config.pagination.pageSize);

    const paths = [];
    
  //definimos la lista de rutas a representar al momento de la compilacion
  for (let page = 2; page <= totalPages; page++) {
    paths.push({ params: { page: page.toString(), slug: category } });
  }
  return{
    paths,
    fallback: true,
  }
}

//Indicamos que ruta queremos representar
export async function getStaticProps({ params }) {
  // console.log(params);
  const category = Config.category.slug;
  console.log("------------page------------");
  console.log(category);
 
  const data = await Api.getItemsCategory(params.page, category);
  // console.log("Items category");
  // console.log(data);
   
  // console.log(data);
  const oneCategory = data.oneCategory.items[0];
  const allCategories = data.allCategories.items;
  const articles = data.articleCollection.items[0].linkedFrom.blogGluoCollection.items;
  const totalArticles = data.articleCollection.items[0].linkedFrom.blogGluoCollection.total;
  const totalPages = Math.ceil(totalArticles / Config.pagination.pageSize);

  return {
    props: {
      oneCategory,
      allCategories,
      articles,
      totalPages,
      currentPage: params.page,
    },
  }
}


export default function IndexPage({ oneCategory, allCategories, articles, currentPage, totalPages})
 {
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
