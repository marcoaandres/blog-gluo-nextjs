import React, { Children } from 'react'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import {Image} from 'next/image'

function renderOptions(links) {
  // create an asset block map
  const assetBlockMap = new Map();
  // loop through the assets and add them to the map
  for (const asset of links.assets.block) {
    assetBlockMap.set(asset.sys.id, asset);
  }

  

  return {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
        // find the asset in the assetBlockMap by ID
        const asset = assetBlockMap.get(node.data.target.sys.id);
        console.log(asset)
        // render the asset accordingly
        return (
                <img src={asset.url} alt={asset.title} />  
                // <p>{asset}</p>     
        )
      },
    },
  };
}

export default function BodyArticle({body}) {
  return (
    <div>
        {
            documentToReactComponents(body.json, renderOptions(body.links))
        }
    </div>
  )
}
