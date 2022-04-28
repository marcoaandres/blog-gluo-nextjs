import React from 'react'
import { Col } from 'react-bootstrap'
import Category from './Category'


export default function SideBar({categories}) {
    console.log(categories)
  return (
    <div>
        <h2>Categorías</h2>
        <div>
            {
                categories.map(category=>(
                    <Col md={12} key={category.slug}>
                        <Category category={category}/>
                    </Col>
                ))
            }
        </div>
    </div>
  )
}
