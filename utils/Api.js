import { Config } from "./Config"

export default class Api {

   //funcion para hacer peticiones a nuestro sitio de contenful
  static async callContentful(query) {
    const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;

    const fetchOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    };

    try {
      const data = await fetch(fetchUrl, fetchOptions).then((response) =>
        response.json(),
      );
      return data;
    } catch (error) {
      throw new Error("Hubo un problema al traer los datos");
    }
  }

  //funcion para pedir el numero total de articulos del blog
  static async getTotalPostsNumber() {
    const query = `
      {
        blogGluoCollection {
          total
        }
      }
    `;

    //usamos la funcion callContenful
    const response = await this.callContentful(query);
    const totalPosts = response.data.blogGluoCollection.total
      ? response.data.blogGluoCollection.total
      : 0;

    return totalPosts;
  }

  //funcion para solicitar solo los articulos de la página correspondiente
  static async getPaginatedPost(page) {
    const skipMultiplier = page === 1 ? 0 : page - 1;
    const skip =
      skipMultiplier > 0 ? Config.pagination.pageSize * skipMultiplier : 0;

    const query = `{
        articleCollection:
            blogGluoCollection(
                limit: ${Config.pagination.pageSize}, 
                skip:${skip}, order: creationDate_DESC) {
                total,
                    items{
                        ...blogGluoFields
                    }
                }
            allCategories:
              categoriasGluoCollection(order: title_ASC){
                  items{
                      title,
                      slug
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
        `;

    //usamos la funcion callContenful
    const response = await this.callContentful(query);
        console.log(response);
    const {data} = response;
    console.log(data);
    
    // const paginatedPost = response.data.articleCollection
    //   ? response.data.articleCollection
    //   : { total: 0, items: [] };

    //   console.log(paginatedPost);
    return data;
  }

  //funcion para obetenr todos los slogs de los articulos
  static async getAllPostsSlug() {
    const query = `
      {
        blogGluoCollection{
            items{
            slug
            }
        }
      }
    `;

    //usamos la funcion callContenful
    const response = await this.callContentful(query);
    const allPostsSlug = response.data.blogGluoCollection;

    return allPostsSlug;
  }

  //funcion para obtener solo un articulo dependiendo el slug
  static async getOnePost(slug) {
    slug = '"' + slug + '"';
   
    const query = `
      {
        allCategories:
          categoriasGluoCollection{
              items{
                  title,
                  slug
              }
          }
        onePost:
          blogGluoCollection(where:{
              slug: ${slug}
          }, limit: 1){
              items{
              ...blogGluoFields
              }
          }
              
      }
      fragment blogGluoFields on BlogGluo{
        title,
        slug,
        excerpt,
        body{
            json,
            links{
              assets{
                block{
                  sys{
                    id
                  },
                  url,
                  title
                }
              }
            }
        },
        metaDescription,
        metaKeywords,
        creationDate,
        author{
          fullName
        },
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
    `;
    //usamos la funcion callContenful
    const response = await this.callContentful(query);
    const post = response.data.onePost;
     
    return post;
  }

  //funcion para obtener todas las categorias
  static async getAllCategories(){
    const query = `
      {
        allCategories:
        categoriasGluoCollection{
            items{
            slug,
            title
            }
        }
      }
    `;
    //usamos la funcion callContenful
    const response = await this.callContentful(query);
    const allCategories = response.data.allCategories;
    
    return allCategories;

  }

  //fuuncion para obtener una categoria y sus post
  static async getItemsCategory(slug, page){
    const skipMultiplier = page === 1 ? 0 : page - 1;
    const skip =
      skipMultiplier > 0 ? Config.pagination.pageSize * skipMultiplier : 0;

    slug = '"' + slug + '"';

      const query = `
        {
          allCategories:
              categoriasGluoCollection(order: title_ASC){
                  items{
                      title,
                      slug
                  }
              }
              oneCategory:
                categoriasGluoCollection(where:{
                    slug: ${slug}
                }, limit: 1){
                    items{
                    title,
                    }
                }
                articleCollection:
                categoriasGluoCollection(where:{
                    slug_contains: ${slug}
                }, limit: 1){
                    items{
                    title,
                    linkedFrom{
                        blogGluoCollection(limit: ${Config.pagination.pageSize}, 
                    skip:${skip}){
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

        
        
      `
    const response = await this.callContentful(query);
    const {data} = response;
    console.log(data);
    return data;
  }

  //funcion para pedir el numero total de articulos del blog
  static async getTotalPostsNumberCategory(slug) {
    slug = '"' + slug + '"';
    const query = `
      {
        articleCollection:
            categoriasGluoCollection(where:{
                slug_contains: "ux"
            }, limit: 1){
                items{
                linkedFrom{
                    blogGluoCollection{
                      total
                  }
              }
            }
          }
      }
    `;

    //usamos la funcion callContenful
    const response = await this.callContentful(query);
    const totalPosts = response.data.articleCollection.items.linkedFrom.blogGluoCollection.total
      ? response.data.articleCollection.items.linkedFrom.blogGluoCollection.total
      : 0;

    return totalPosts;
  }
}