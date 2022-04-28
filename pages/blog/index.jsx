import { createClient } from "contentful"
import { Col, Container, Row } from "react-bootstrap"
import Article from "../../components/Article"
import Layout from "../../components/Layout"
import SideBar from "../../components/SideBar"

// Traer contenido de tipo 'blog' en forma estatica
export async function getStaticProps(){

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
                  title,
                  slug
                }
              }
              articleCollection:
              blogGluoCollection(limit: 10){
                items{
                  ...blogGluoFields
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
          }`
      }) 
  });

  if(!result.ok){
      console.log(error);
      return {};
  }
  const {data} = await result.json();
  const categories = data.allCategories.items;
  const articles = data.articleCollection.items;


  return {
        props:{
          articles,
          categories
        },
        //Regeneracion estatica incremental
        //Una vez cargado el contenido esperamos como maximo 1s para acceder al contenido en servidor
        // y verificar si hay cambios 
        revalidate: 1

        
  }
}

export default function Home({articles, categories}) {
  // console.log(categories)
    
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
                        <SideBar categories={categories} />
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


