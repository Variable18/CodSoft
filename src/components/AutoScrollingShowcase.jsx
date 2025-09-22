import { useEffect, useRef, useState } from 'react';

export default function AutoScrollingShowcase({ games }) {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    if (games.length === 0) return;

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % games.length);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [games.length]);

  if (!games.length) return null;

  const game = games[current];

  // Compose full image URL if coverUrl is relative
  // Assuming backend serves images at http://localhost:8080
  const imageUrl = game.coverUrl.startsWith('http')
    ? game.coverUrl
    : `http://localhost:8080${game.coverUrl}`;

  return (
    <section className="w-full flex justify-center mx-auto mb-12">
      <div
        className="relative group shadow-xl overflow-hidden"
        style={{
          height: 550,
          borderRadius: 0,
          width: '90vw',
          maxWidth: '100vw',
        }}
      >
        <img
            src={game.coverUrl}
            alt={game.name}
            className="w-full h-full object-cover"
            style={{ borderRadius: 0 }}
            />

        
        <div
          className="absolute bottom-0 left-0 flex flex-col items-start justify-end p-10 bg-gradient-to-t from-black/70 via-transparent to-transparent w-full h-full pointer-events-none"
          style={{ zIndex: 2 }}
        >
          <h2 className="text-4xl font-extrabold mb-2 text-white drop-shadow pointer-events-auto">
            {game.name}
          </h2>
          <p className="text-lg text-gray-200 mb-6 drop-shadow pointer-events-auto max-w-lg">
            {game.description ?? 'No description available.'}
          </p>
        </div>
      </div>
    </section>
  );
}
