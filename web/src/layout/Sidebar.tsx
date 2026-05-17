import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Sessions', path: '/sessions', icon: 'terminal' },
    { name: 'Reports', path: '/reports', icon: 'analytics' },
    { name: 'Settings', path: '/settings', icon: 'settings' },
    { name: 'Profile', path: '/profile', icon: 'account_circle' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col py-6 px-4 bg-[#0E0E0E] dark:bg-[#0E0E0E] docked w-64 border-r-0 rounded-r-[2rem] z-50">
      <div className="mb-10 px-4">
        <h1 className="text-xl font-black tracking-tighter text-[#9CFF93] mb-1">FreelanceCLI</h1>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-on-surface-variant">v1.0.4</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-[#9CFF93] font-bold bg-[#191919] scale-98 active:opacity-80'
                  : 'text-[#ABABAB] font-medium hover:bg-[#262626] hover:text-[#FFFFFF] duration-200'
              }`}
            >
              <span className="material-symbols-outlined" data-icon={link.icon}>{link.icon}</span>
              <span className="font-label text-sm tracking-wide">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2 space-y-4">
        <div className="pt-2 space-y-2">
          <span onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-[#ABABAB] font-medium hover:text-error transition-colors cursor-pointer">
            <span className="material-symbols-outlined" data-icon="logout">logout</span>
            <span className="text-sm">Logout</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
