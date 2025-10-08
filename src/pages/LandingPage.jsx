import Sidebar from '../components/Sidebar';

export default function LandingPage({ onLogout }) {
  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '2rem' }}>
        <button onClick={onLogout} style={{ marginBottom: '1rem' }}>Logout</button>
        <h1>Welcome to Progetto</h1>
        <p>Select a menu option to get started.</p>
      </main>
    </div>
  );
}
