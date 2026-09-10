import '../../styles/Message.css'

function ProductCard({ product, imageUrl, onDelete, disabled }) {
  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img src={imageUrl} alt={product.title} className="product-image" />
      </div>
      <h3 className="product-title">{product.title}</h3>
      <p className="product-description">{product.description}</p>
      <div className="product-card-footer">
        <span className="product-price">от {product.price} ₽</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDelete(product.id)}
          className="product-delete"
        >
          Удалить
        </button>
      </div>
    </article>
  )
}

export default ProductCard
