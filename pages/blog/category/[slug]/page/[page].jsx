import Api from '@utils/Api';
import { Config } from '@utils/Config';
import React from 'react'

export async function getStaticPaths(){
    const totalArticles = await Api.getTotalPostsNumber();
    const totalPages = Math.ceil(totalArticles / Config.pagination.pageSize);

    const paths = [];
    
  //definimos la lista de rutas a representar al momento de la compilacion
  for (let page = 2; page <= totalPages; page++) {
    paths.push({ params: { page: page.toString() } });
  }
  return{
    paths,
    fallback: true,
  }
}

//Indicamos que ruta queremos representar
export async function getStaticProps({ params }) {
 
  const data = await Api.getItemsCategory( params.page );
   console.log(params);
  // console.log(data);
  // const allCategories = data.allCategories.items;
  // const articles = data.articleCollection.items;
  // const totalArticles = data.articleCollection.total;
  // const totalPages = Math.ceil(totalArticles / Config.pagination.pageSize);

  return {
    props: {
      allCategories,
      articles,
      totalPages,
      currentPage: params.page,
    },
  }
}


export default function IndexPage() {
  return (
    <div>IndexPage</div>
  )
}
