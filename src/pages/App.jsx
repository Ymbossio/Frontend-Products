import { useState, useEffect } from 'react'
import { fetchProducts } from '../api/products'
import 'bootstrap/dist/css/bootstrap.min.css'
import {PaymentModal} from '../components/Modal'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedProduct, clearSelectedProduct } from '../redux/ProductSlice'

function App() {

  const [products, setProducts] = useState([])
  const [detailsCard, setDetailsCard] = useState(false)
  const selectedProduct = useSelector(state => state.product.selectedProduct)
  const dispatch = useDispatch()

  
  const openPaymentModal = (product) => {
    dispatch(setSelectedProduct(product))
    setDetailsCard(true)
  };

  const closePaymentModal = () => {
    dispatch(clearSelectedProduct())
  };


  useEffect(() => {
    fetchProducts().then(setProducts)
  }, [])
return (
  <>
    <h1 className="text-center my-4">⚙️ Market Products 🔧</h1>

    <div className="container">
      <div className="row g-4">
        {products.map((product) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={product.id}>
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
                <p className="card-text fw-bold text-primary">Price: ${product.price }</p>
                <p className="card-text text-muted">Stock: {product.stock}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => openPaymentModal(product)}
                >
                  Pagar con tarjeta 💳
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <PaymentModal 
        product={selectedProduct}
        detailsCard={detailsCard}
        setDetailsCard={setDetailsCard}
        onClose={closePaymentModal}
        setProducts={setProducts}
    />
  </>
);

}

export default App
