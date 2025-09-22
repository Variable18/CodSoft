import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SummerSaleBlock() {
  const [games, setGames] = useState([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

 useEffect(() => {
  async function fetchGames() {
    try {
      const response = await fetch('http://localhost:8080/api/games/popular');
      const data = await response.json();
      setGames(data.slice(0, 5)); // Only take first 5 games
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  }
  fetchGames();
}, []);


  useEffect(() => {
    if (games.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % games.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [games]);

  if (games.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto my-8 bg-gradient-to-r from-green-700 to-green-500 rounded-xl shadow-lg">
        <h2 className="text-4xl font-extrabold mb-4 text-black">Summer Sale</h2>
        <p className="text-xl font-semibold mb-6 text-black">Loading games...</p>
      </div>
    );
  }

  const game = games[current];

  return (
    <div
      onClick={() => navigate('/sales')}
      className="cursor-pointer p-8 max-w-4xl mx-auto my-8 bg-gradient-to-r from-green-700 to-green-500 rounded-xl shadow-lg text-black"
      role="button"
      aria-label="Go to Summer Sale page"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate('/sales'); }}
    >
      <h2 className="text-4xl font-extrabold mb-4">Summer Sale</h2>
      <p className="text-xl font-semibold mb-6">Save 25% to 50% on top games! Limited time only.</p>
      <div className="flex flex-col items-center justify-center" style={{ minHeight: 240 }}>
        <img
          src={game.coverUrl}
          alt={game.name}
          style={{
            width: 320,
            height: 180,
            borderRadius: '12px',
            objectFit: 'cover',
            boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
            transition: 'opacity 0.01s'
          }}
        />
        <div className="mt-4 text-2xl font-bold text-black">{game.name}</div>
      </div>
    </div>
  );
}
