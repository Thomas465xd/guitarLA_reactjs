import { useState, useEffect } from "react"
import Header from "./components/Header"
import Guitar from "./components/Guitar"
import { db } from "./data/db"

function App() {

    /*
    const  [auth, setAuth] = useState(false)

    useEffect(() => {
        if(auth) {
            console.log("Caragando...");
        }

        console.log("Escuchando por Auth");
    }, [auth])

    setTimeout(() => {
        setAuth(true)
    }, 3000);
    */

    const initialCart = () => {
        const localStorageCart = localStorage.getItem("cart");
        return localStorageCart ? JSON.parse(localStorageCart) : [];
    }

    const [data, setData] = useState(db);
    const [cart, setCart] = useState(initialCart);

    const max_items = 5;
    const min_items = 1;

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart])

    function addToCart(item) {

        const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
        //console.log(itemExists)

        if(itemExists >= 0) {
            if(cart[itemExists].quantity >= max_items) {
                return;
            }
            //console.log("El Producto ya existe")
            //cart[itemExists].quantity++; // This mutates the original array 

            const updatedCart = [...cart];
            updatedCart[itemExists].quantity++;
            setCart(updatedCart);

        } else {
            //console.log("no existe, agregando...")
            item.quantity = 1; // Add quantity
            setCart([...cart, item]);
        }

        
    }

    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id) {
        const updatedCart = cart.map( item => {

            if(item.id === id && item.quantity < max_items) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }

            return item;
        })
        setCart(updatedCart);
    }

    function decreaseQuantity(id) {
        const updatedCart = cart.map( item => {

            if(item.id === id && item.quantity > min_items) {
                return {
                    ...item, 
                    quantity: item.quantity - 1
                }
            }

            return item;
        })
        setCart(updatedCart);
    }

    function clearCart() {
        setCart([]);
    }

    //function saveLocalStorage() {
    //    localStorage.setItem("cart", JSON.stringify(cart));
    //}

    return (
            <>
            <Header 
                cart = {cart}
                removeFromCart = {removeFromCart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                clearCart={clearCart}
            />

            <main className="container-xl mt-5">
                <h2 className="text-center">Nuestra Colección</h2>

                <div className="row mt-5">
                    {data.map((guitar) => (
                            <Guitar 
                                key = {guitar.id}
                                guitar = {guitar}
                                setCart={setCart}
                                addToCart={addToCart}
                            />
                        )
                    )}
                </div>
            </main>


            <footer className="bg-dark mt-5 py-5">
                <div className="container-xl">
                    <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados {new Date().getFullYear()}</p>
                </div>
            </footer>
            </>
        )
}

export default App
