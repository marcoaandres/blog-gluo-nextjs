import React from 'react'
import Head from 'next/head'

export default function Layout({children, titlePage, metaDescription, metakeywords }) {
  return (
    <div className='container-fluid'>
        <Head>
            {/* 55 caracteres como máximo */}
            <title>{titlePage} | gluo</title>
            {/* 160  caracteres como máximo */}
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metakeywords}/>
            {/* indexacion e una pagina por los robots */}
             {/* <meta name="robots" content="index"/> */}
             {/* Seguimineto de todos los enlaces por los robots */}
             {/* <meta name="robots" content="follow"/> */}
             <meta name="robots" content="index, follow"/>

        </Head>
        <header>
            {/* <h3>Header</h3> */}
            <nav>
                {/* <h3>Navbar</h3> */}
            </nav>
        </header>
        
        <main>
            {/* Contenido principal */}
            {children}
        </main>
        <footer>
            {/* <h3>Footer</h3> */}
        </footer>
    </div>
  )
}


/**propiedades por defecto */
Layout.defaultProps = {
    titlePage: 'Título por default',
    metaDescription: 'Descripción por default',
    metakeywords: 'keydefault 1, keydefault 2',

}