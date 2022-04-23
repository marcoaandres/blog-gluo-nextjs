import { Col, Container, Row } from "react-bootstrap"
import Link from 'next/link'
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout
    titlePage="Inicio"
    metaDescription="Descripción de mi página de inicio"
    metakeywords="inicio, gluo, keywords">
      <h1>Sitio Gluo</h1>
      <section>
        <Container>
          <Link href={'/blog'}>
              <a>Ir a blog</a>
          </Link>
        </Container>
      </section>
    </Layout>
  )
}


