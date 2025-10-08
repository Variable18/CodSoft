import { useEffect, useRef, useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import AutoScrollingShowcase from '../components/AutoScrollingShowcase.jsx';
import Header from '../components/Header.jsx';

const scrollbarHideStyles = {
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  overflowY: 'hidden',
};

function GameCard({ game, hoverContent }) {
  return (
    <div className="game-card bg-gray-900 rounded-xl relative group cursor-pointer w-80 flex-shrink-0 overflow-hidden shadow-lg mx-2">
      <img
        src={game.coverUrl}
        alt={game.name}
        className="game-image rounded-xl w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div
        className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 rounded-xl"
        style={{ zIndex: 2 }}
      >
        <div>
          <h4 className="text-lg font-bold text-white mb-2 truncate">{game.name}</h4>
          <p className="text-sm text-gray-200 line-clamp-3 mt-2">{game.description ?? 'No description available.'}</p>
        </div>
        {hoverContent && <div className="flex space-x-3 mt-4">{hoverContent}</div>}
      </div>
      <div className="mt-2 text-white font-semibold truncate">{game.name}</div>
    </div>
  );
}

function ScrollableGameSection({ title, games, childrenFn }) {
  const containerRef = useRef();

  function scrollBy(distance) {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  }

  return (
    <section className="mb-16 w-full max-w-[95vw] mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-white">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scrollBy(-400)}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-70 text-white rounded-full p-2"
          style={{ minWidth: 36 }}
        >
          &#8249;
        </button>
        <div
          ref={containerRef}
          style={{ ...scrollbarHideStyles, display: 'flex', gap: 30, overflowX: 'auto' }}
          className="scrollbar-hide py-2 px-10"
        >
          {games.map((game) => (
            <GameCard key={game.id} game={game} hoverContent={childrenFn(game)} />
          ))}
        </div>
        <button
          onClick={() => scrollBy(400)}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-70 text-white rounded-full p-2"
          style={{ minWidth: 36 }}
        >
          &#8250;
        </button>
      </div>
    </section>
  );
}

function splitUniqueGameSets(games, counts) {
  let idx = 0;
  return counts.map(count => games.slice(idx, idx += count));
}

function Footer() {
   return (
    <footer className="bg-gray-900 text-gray-400 py-10 border-t border-gray-800">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:justify-between gap-12 px-4">
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-3xl font-bold text-green-500 mb-2">GameStore</h2>
          <div className="mb-2">
            <span className="font-semibold">Address: </span>
            Tech Park, Sector 16, Mumbai, India
          </div>
          <div className="mb-2">
            <span className="font-semibold">Phone: </span>
            +91 98765 43210
          </div>
          <div className="mb-2">
            <span className="font-semibold">Hours: </span>
            10:00 - 18:00, Mon - Sat
          </div>
          <div className="flex space-x-3 mt-3">
            <a href="#" className="text-gray-400 hover:text-green-500"><FaFacebookF /></a>
            <a href="#" className="text-gray-400 hover:text-pink-600"><FaInstagram /></a>
            <a href="#" className="text-gray-400 hover:text-blue-600"><FaTwitter /></a>
            <a href="#" className="text-gray-400 hover:text-red-600"><FaYoutube /></a>
          </div>
        </div>


        <div className="flex-1 min-w-[150px]">
          <h3 className="font-bold mb-2">About</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Delivery Information</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>


        <div className="flex-1 min-w-[150px]">
          <h3 className="font-bold mb-2">My Account</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Sign In</a></li>
            <li><a href="#" className="hover:underline">View Cart</a></li>
            <li><a href="#" className="hover:underline">Help</a></li>
          </ul>
        </div>


        <div className="flex-1 min-w-[180px]">
          <h3 className="font-bold mb-2">Install App</h3>
          <div className="flex space-x-2 mb-3">
            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-8" />
          </div>
          <div className="mt-4">
            <div className="text-sm mb-1">Secured Payment Gateways</div>
            <div className="flex space-x-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/RuPay.svg" alt="RuPay" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/bd/PayPal_Logo_2007.png" alt="PayPal" className="h-6" />
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-10 mb-2">© 2025 GameStore. All rights reserved.</div>
    </footer>
  );
}

export default function Home() {
  const [sponsoredGames, setSponsoredGames] = useState([]);
  const [summerSaleGames, setSummerSaleGames] = useState([]);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [newReleaseGames, setNewReleaseGames] = useState([]);
  const [freeClaimGames, setFreeClaimGames] = useState([]);
  const [freeToPlayGames, setFreeToPlayGames] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // Fetch current cart items on mount, if logged in (i.e. token available)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:8080/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data);
      })
      .catch((err) => console.error('Failed to fetch cart:', err));
  }, []);

  useEffect(() => {
    async function fetchSponsored() {
      try {
        const response = await fetch('http://localhost:8080/api/games/sponsored');
        const data = await response.json();
        setSponsoredGames(data);
      } catch (error) {
        console.error('Failed to load sponsored games', error);
      }
    }
    fetchSponsored();

    async function fetchAndSplitGames() {
      try {
        const response = await fetch('http://localhost:8080/api/games/popular?page_size=50');
        const allGames = await response.json();

        const uniqueGames = [];
        const seen = new Set();
        for (const g of allGames) {
          if (!seen.has(g.id)) {
            uniqueGames.push(g);
            seen.add(g.id);
          }
        }

        const [sale, featured, newR, claim, free] = splitUniqueGameSets(uniqueGames, [5, 5, 5, 5, 15]);
        setSummerSaleGames(sale);
        setFeaturedGames(featured);
        setNewReleaseGames(newR);
        setFreeClaimGames(claim);
        setFreeToPlayGames(free);
      } catch (error) {
        console.error('Failed to load games', error);
      }
    }
    fetchAndSplitGames();
  }, []);

  async function handleAddToCart(game) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first!');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/cart/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gameId: game.id,
          name: game.name,
          coverUrl: game.coverUrl,
          price: 3500, // Placeholder price or add logic for price
        })
      });

      if (!response.ok) throw new Error('Failed to add to cart');

      const newCartItem = await response.json();
      setCartItems(prev => [...prev, newCartItem]);
      alert(`${game.name} added to cart!`);
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart. Please try again.');
    }
  }

  function renderPriceTag(originalPrice = 3500) {
    const discount = 0.5;
    const discountedPrice = originalPrice * (1 - discount);
    return (
      <div>
        <span style={{ textDecoration: 'line-through', marginRight: 6, color: '#ccc' }}>
          ₹{originalPrice.toFixed(0)}
        </span>
        <span style={{ color: '#12D981', fontWeight: 'bold' }}>
          ₹{discountedPrice.toFixed(0)}
        </span>
        <span style={{ marginLeft: 6, color: '#f59e0b', fontWeight: 'bold' }}>50% OFF</span>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main
        className="min-h-screen p-6 space-y-16 pt-[80px]"
        style={{
          background: 'linear-gradient(135deg, #101820 60%, #06ffc7 100%)',
          boxShadow: '0 0 100px 40px rgba(6,255,199,0.05) inset',
        }}
      >

        <AutoScrollingShowcase games={sponsoredGames} />

        <ScrollableGameSection
          title="Summer Sale"
          games={summerSaleGames}
          childrenFn={(game) => (
            <>
              {renderPriceTag(3500)}
              <button
                className="btn-add-to-cart px-3 py-1 rounded bg-emerald-500 text-white font-semibold"
                onClick={e => {
                  e.stopPropagation();
                  handleAddToCart(game);
                }}
              >
                Add to Cart
              </button>
            </>
          )}
        />

        <ScrollableGameSection
          title="Featured Games"
          games={featuredGames}
          childrenFn={(game) => (
            <>
              <button
                className="btn-add-to-cart px-3 py-1 rounded bg-emerald-500 text-white font-semibold"
                onClick={e => {
                  e.stopPropagation();
                  handleAddToCart(game);
                }}
              >
                Add to Cart
              </button>
            </>
          )}
        />

        <ScrollableGameSection
          title="New Releases"
          games={newReleaseGames}
          childrenFn={(game) => (
            <>
              <button
                className="btn-add-to-cart px-3 py-1 rounded bg-emerald-500 text-white font-semibold"
                onClick={e => {
                  e.stopPropagation();
                  handleAddToCart(game);
                }}
              >
                Add to Cart
              </button>
            </>
          )}
        />

        <ScrollableGameSection
          title="Free to Claim (24 hours)"
          games={freeClaimGames}
          childrenFn={game => (
            <button
              className="btn-claim px-3 py-1 rounded bg-blue-600 text-white font-semibold"
              onClick={e => {
                e.stopPropagation();
                alert('Claimed: ' + game.name);
              }}
            >
              Claim
            </button>
          )}
        />
        <ScrollableGameSection
          title="Free to Play"
          games={freeToPlayGames}
          childrenFn={game => (
            <button
              className="btn-play px-3 py-1 rounded bg-green-600 text-white font-semibold"
              onClick={e => {
                e.stopPropagation();
                alert('Play: ' + game.name);
              }}
            >
              Play
            </button>
          )}
        />
      </main>
      <Footer />
    </>
  );
}

