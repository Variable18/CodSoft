import { useEffect, useRef, useState } from 'react';

export default function GamePublisherSection({ publisher, title }) {
  const [games, setGames] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch(`http://localhost:8080/api/games/popular?publisher=${encodeURIComponent(publisher)}`);
        const data = await response.json();
        setGames(data);
      } catch (err) {
        console.error('Error fetching games:', err);
      }
    }
    fetchGames();
  }, [publisher]);

  const scrollBy = (distance) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  return (
    <section className="my-8 max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      <div className="relative">
        <button 
          onClick={() => scrollBy(-300)} 
          aria-label="Scroll left" 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full p-2"
        >&lt;</button>

        <div 
          ref={containerRef} 
          style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollBehavior: 'smooth' }}
        >
          {games.map(game => (
            <div 
              key={game.id} 
              style={{ 
                display: 'inline-block', 
                width: 250, 
                marginRight: 16, 
                backgroundColor: '#111', 
                borderRadius: 8, 
                color: 'white' 
              }}
            >
              <img 
                src={game.coverUrl} 
                alt={game.name} 
                style={{ width: '100%', borderRadius: 8, objectFit: 'cover', height: 140 }} 
              />
              <div style={{ padding: '0.5rem', fontWeight: 'bold', fontSize: 16 }}>{game.name}</div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scrollBy(300)} 
          aria-label="Scroll right" 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full p-2"
        >&gt;</button>
      </div>
    </section>
  );
}
