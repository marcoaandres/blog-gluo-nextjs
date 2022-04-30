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
    
    const paginatedPost = response.data.articleCollection
      ? response.data.articleCollection
      : { total: 0, items: [] };

    //   console.log(paginatedPost);
    return paginatedPost;
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
}