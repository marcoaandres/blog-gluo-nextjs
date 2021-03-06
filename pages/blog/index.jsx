import { createClient } from "contentful"
import { Col, Container, Row } from "react-bootstrap"
import Article from "@components/Article"
import Layout from "@components/Layout"
import SideBar from "@components/SideBar"
import Api from "@utils/Api"
import {Config} from "@utils/Config"
import Pagination from "@components/Pagination"

// Traer contenido de tipo 'blog' en forma estatica
export async function getStaticProps(){
  const data = await Api.getPaginatedPost(1);
  // console.log(data);
  const paginatedPost = data.articleCollection
      ? data.articleCollection
      : { total: 0, items: [] };

  const allCategories = data.allCategories.items;
  const articles = paginatedPost.items;
  const totalArticles = paginatedPost.total;
  const totalPages = Math.ceil(totalArticles / Config.pagination.pageSize);

  return{
    props:{
      allCategories,
      articles,
      totalPages,
      currentPage: "1",
    }

  }
}
export default function Home({ articles, totalPages, currentPage, allCategories }) {
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


