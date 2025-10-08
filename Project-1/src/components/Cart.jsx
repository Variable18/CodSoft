import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function fetchCart() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8080/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch cart');

        const data = await response.json();

        if (!cancelled) {
          setCartItems(Array.isArray(data) ? data : data.cart || []);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setCartItems([]);
          setLoading(false);
        }
      }
    }

    fetchCart();

    return () => {
      cancelled = true;
    };
  }, []);

  // Generate random price for demonstration
  const getRandomPrice = () => (Math.random() * 50 + 10).toFixed(2);

  // Remove game from cart handler
  const handleRemove = async (gameIdToRemove) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first!');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ gameId: gameIdToRemove }),
      });

      if (!response.ok) throw new Error('Failed to remove item from cart');

      setCartItems((prev) => prev.filter(game => (game.gameId || game.id) !== gameIdToRemove));
    } catch (error) {
      console.error(error);
      alert('Could not remove item. Please try again.');
    }
  };


  if (loading) {
    return (
      <>
        <Header />
        <main className="p-4 text-white bg-gray-900 min-h-screen">Loading cart items...</main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-tr from-gray-800 via-gray-900 to-black px-6 py-8 text-white">
        <h1 className="text-4xl font-bold mb-10 drop-shadow-lg">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p className="text-gray-400 text-xl">Your cart is empty.</p>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {cartItems.map((game) => (
              <div
                key={game.gameId || game.id}
                className="flex bg-black bg-opacity-70 rounded-lg shadow-md overflow-hidden relative"
                style={{ minHeight: '150px' }}
              >
                {/* 40% image */}
                <div className="w-2/5">
                  <img
                    src={game.coverUrl}
                    alt={game.name}
                    className="object-cover h-full w-full"
                  />
                </div>

                {/* 60% content */}
                <div className="w-3/5 p-5 flex flex-col justify-center relative">
                  <h2 className="text-2xl font-extrabold mb-3">{game.name}</h2>
                  <p className="text-lg font-semibold text-emerald-400">
                    ${game.price ? game.price.toFixed(2) : getRandomPrice()}
                  </p>

                  <button
                    onClick={() => handleRemove(game.gameId || game.id)}
                    className="absolute top-3 right-3 px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 text-right max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/checkout')}
              className="mt-6 px-8 py-3 bg-green-600 hover:bg-green-700 rounded text-white font-semibold text-lg shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>
      </main>
    </>
  );
}
