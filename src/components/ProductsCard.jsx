
export function ProductCard({ product, onBuy }) {
  return (
    <div className="card h-100 text-center shadow-sm">
      <img
        src={product.image}
        alt={product.title}
        className="card-img-top img-fluid"
        style={{ height: '250px', objectFit: 'contain' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <p className="card-text fw-bold text-primary">Price: ${product.price}</p>
        <p className="card-text text-muted">Stock: {product.stock}</p>
        <button className="btn btn-primary mt-auto" onClick={() => onBuy(product)}>
          Adquirir 💳
        </button>
      </div>
    </div>
  );
}
