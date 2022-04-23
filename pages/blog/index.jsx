import { createClient } from "contentful"
import { Col, Container, Row } from "react-bootstrap"
import Article from "../../components/Article"
import Layout from "../../components/Layout"

//api client contentful
const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  space: process.env.CONTENTFUL_SPACE_ID
})


// Traer contenido de tipo 'blog' en forma estatica
export async function getStaticProps(){
  const res = await client.getEntries({ content_type: 'blogGluo' })

  return {
    props:{
      articles: res.items,
    }
  }
}

export default function Home({articles}) {
    
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
                        <h2>Categorías</h2>
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
      </section>
    </Layout>
  )
}


