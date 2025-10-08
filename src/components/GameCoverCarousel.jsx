export default function GameCoverCarousel({ covers }) {
  return (
    <div style={{ display: 'flex', overflowX: 'auto', padding: '1rem', gap: '1rem' }}>
      {covers.map((cover, idx) => (
        <img
          key={idx}
          src={cover.url}
          alt={cover.title}
          style={{ width: '150px', height: '220px', borderRadius: '8px', flexShrink: 0, cursor: 'pointer' }}
        />
      ))}
    </div>
  );
}
