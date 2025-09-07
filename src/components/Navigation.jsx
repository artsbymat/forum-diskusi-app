import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, MessageSquare, Trophy, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/states/auth/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const navigationItems = [
  {
    name: 'Beranda',
    to: '/',
    icon: Home
  },
  {
    name: 'Leaderboard',
    to: '/leaderboard',
    icon: Trophy
  }
];

function NavigationLinks({ pathname }) {
  return (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.to;
        return (
          <Link key={item.name} to={item.to}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              className="gap-2 cursor-pointer"
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Button>
          </Link>
        );
      })}
    </>
  );
}

export function Navigation({ user }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Forum Diskusi</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <NavigationLinks pathname={pathname} />
            </div>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline font-medium">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          ) : (
            pathname !== '/login' &&
            pathname !== '/register' && (
              <Link to="/login">
                <Button variant="default" size="sm" className="cursor-pointer">
                  Masuk
                </Button>
              </Link>
            )
          )}
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex items-center gap-1">
            <NavigationLinks pathname={pathname} />
          </div>
        </div>
      </div>
    </nav>
  );
}
