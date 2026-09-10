function ProductCard({ product, imageUrl, onDelete, disabled }) {
  return (
    <article style={styles.card}>
      <div style={styles.imageWrapper}>
        <img src={imageUrl} alt={product.title} style={styles.image} />
      </div>
      <h3 style={styles.title}>{product.title}</h3>
      <p style={styles.description}>{product.description}</p>
      <div style={styles.cardFooter}>
        <span style={styles.price}>от {product.price} ₽</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDelete(product.id)}
          style={styles.deleteBtn}
        >
          Удалить
        </button>
      </div>
    </article>
  )
}

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "1px solid #eee",
    borderRadius: "18px",
    padding: "12px",
  },
  imageWrapper: {
    backgroundColor: "#fff0e6",
    borderRadius: "14px",
    padding: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "12px",
  },
  image: {
    width: "100%",
    maxWidth: "220px",
    height: "220px",
    objectFit: "contain",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 8px 0",
  },
  description: {
    fontSize: "13px",
    color: "#828282",
    lineHeight: "1.3",
    margin: "0 0 16px 0",
    flexGrow: 1,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  deleteBtn: {
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "20px",
    fontWeight: "bold",
    cursor: "pointer",
  },
}

export default ProductCard
