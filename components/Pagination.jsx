import React from 'react'
import Link from 'next/link'

export default function Pagination({totalPages, currentPage, prevDisabled, nextDisabled, category}) {

    // console.log(category);
        //pagina anterior
    let prevPage =
    currentPage === "2"
      ? "/blog"
      : `/blog/page/${parseInt(currentPage, 10) - 1}`;

    //pagina siguiente
    let nextPage = 
    `/blog/page/${parseInt(currentPage, 10) + 1}`;

    
    if(category){
        //pagina anterior
    prevPage =
    currentPage === "2"
      ? `/blog/${category}`
      : `/blog/${category}/page/${parseInt(currentPage, 10) - 1}`;

    //pagina siguiente
    nextPage = 
    `/blog/${category}/page/${parseInt(currentPage, 10) + 1}`;

    }
    

  return (
    <nav aria-label="Page navigation example" className="mt-5">
        <ul className="pagination justify-content-end">
            {prevDisabled && (<li className="page-item disabled">
                <Link href={prevPage}>
                    <a className="page-link">Página anterior</a>
                </Link>
            </li>)}
           {!prevDisabled && (<li className="page-item">
                <Link href={prevPage}>
                    <a className="page-link">Página anterior</a>
                </Link>
            </li>)}
            <li className="page-item disabled"><span className="page-link">{currentPage} - {totalPages}</span></li>
            {nextDisabled && (<li className="page-item disabled">
                <Link href={nextPage}>
                    <a className="page-link">Página siguiente</a>
                </Link>
            </li>)}
            {!nextDisabled && (<li className="page-item">
                <Link href={nextPage}>
                    <a className="page-link">Página siguiente</a>
                </Link>
            </li>)}
        </ul>
    </nav>
  )
}
