import React, { useState, useEffect } from 'react'
import { Navbar, Products, Cart, Checkout } from './components';
import { commerce } from './lib/commerce.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchProducts = async () => {
        const { data } = await commerce.products.list();
        setProducts(data);
    }

    const fetchCart = async () => {
        const cartList = await commerce.cart.retrieve();
        setCart(cartList);
    }

    const handleAddToCart = async (productId, quantity) => {
        const result = await commerce.cart.add(productId, quantity);
        setCart(result.cart);
    }

    const handleUpdateCart = async (lineItemId, quantity) => {
        const response = await commerce.cart.update(lineItemId, { quantity });
        setCart(response.cart);
    };

    const handleRemoveCartItems = async (productId) => {
        const response = await commerce.cart.remove(productId);
        setCart(response.cart);
    }

    const handleEmptyCart = async () => {
        const response = await commerce.cart.empty();
        setCart(response.cart);
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
        console.log('newCart', newCart);
        setCart(newCart);
    };

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
          const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
          setOrder(incomingOrder);
          console.log('imcomming', incomingOrder)
          refreshCart();
        } catch (error) {
          setErrorMessage(error.data.error.message);
          console.log('err', error.data.error.message)
        }
    };
    
    useEffect(() => {
        fetchProducts()
        fetchCart()
    }, []);
    
    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />
                <Switch>
                    <Route exact path="/">
                        <Products products={products} onAddToCart={handleAddToCart} />
                    </Route>
                    <Route exact path="/cart">
                        <Cart 
                            cart={cart} 
                            handleUpdateCart={handleUpdateCart}
                            handleRemoveCartItems={handleRemoveCartItems}
                            handleEmptyCart={handleEmptyCart}
                        />
                    </Route>
                    <Route exact path="/checkout">
                        <Checkout 
                            cart={cart}
                            order={order} 
                            onCaptureCheckout={handleCaptureCheckout} 
                            error={errorMessage}
                        />
                    </Route>
                </Switch>
            
            </div>
        </Router>
    )
}

export default App;
