import React from "react";
import { getImage, simpleId } from './helpers.js'

export default class Products extends React.Component {
  render() {
    return (
      <div>
        {this.props.products.map((product) =>
          <div key={product.id}>
            {getImage(product.id, product.image)}
            <p className="details">
              <a href={"/product/" + simpleId(product.id)}>
                {product.alternateName || product.name && product.name[this.props.lang]}
              </a>
              <br />
              {(product.slogan && product.slogan[this.props.lang]) || (product.name && product.name[this.props.lang])}
            </p>
          </div>
        )}
        <p />
      </div>
    );
  }
}
