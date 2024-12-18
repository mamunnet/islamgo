import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  BookOpenIcon as BookOpenIconSolid, 
  ClockIcon as ClockIconSolid
} from '@heroicons/react/24/solid';

const Navigation = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'Quran', path: '/quran', icon: BookOpenIcon, activeIcon: BookOpenIconSolid },
    { name: 'Prayer', path: '/prayer', icon: ClockIcon, activeIcon: ClockIconSolid }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/25 backdrop-blur-lg border-t border-white/20 shadow-[0_-8px_15px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const ActiveIcon = item.activeIcon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center py-3 transition-colors relative ${
                    isActive 
                      ? 'text-color-primary' 
                      : 'text-gray-600 hover:text-color-primary hover:bg-white/10'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <ActiveIcon className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                    <span className="text-xs mt-1 font-medium">{item.name}</span>
                    {isActive && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-color-primary rounded-b-full" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
