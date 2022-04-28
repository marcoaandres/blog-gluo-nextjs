// {
// #   Consulta a categorias
  
//   # categoriasGluoCollection{
//   #   items{
//   #     title,
//   #     slug
//   #   }
//   # }
  
  
// # Consulta a todos los blogs  
  
//   # blogGluoCollection(limit: 10){
//   #   items{
//   #     ...blogGluoFields
//   #   }
//   # }
  
// # Filtrado de categorias, se muestra los articulos de cada categoria
  
//   categoriasGluoCollection(where:{
//     title_contains: "Cultura Gluo"
//   }, limit: 1){
//     items{
//       title,
//       linkedFrom{
//        	blogGluoCollection(limit: 10){
//           items{
//             ...blogGluoFields
//           }
//         }
//       }
//     }
//   }

  
// }

// # Fragment reutilizacion de codigo
// fragment blogGluoFields on BlogGluo{
//   title,
//   thumbnail{
//     url,
//   }
//   categoryCollection{
//     items{
//       title

//     }
//   }
// }