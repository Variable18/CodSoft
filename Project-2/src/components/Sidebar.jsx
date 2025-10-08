import { NavLink, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'My Projects', path: '/projects' },
  { name: 'Track Progress', path: '/trackprogress' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">Progetto</div>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <NavLink to={item.path} className="sidebar-link">
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
