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
    { 
      name: 'হোম', 
      path: '/', 
      icon: HomeIcon, 
      activeIcon: HomeIconSolid,
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      name: 'কুরআন', 
      path: '/quran', 
      icon: BookOpenIcon, 
      activeIcon: BookOpenIconSolid,
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      name: 'নামাজ', 
      path: '/prayer', 
      icon: ClockIcon, 
      activeIcon: ClockIconSolid,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-white/20 shadow-[0_-8px_15px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const ActiveIcon = item.activeIcon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex flex-col items-center py-3 transition-all duration-300 relative
                  ${isActive ? 'scale-110' : 'hover:scale-105'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className={`
                      p-2 rounded-xl transition-all duration-300
                      ${isActive 
                        ? `bg-gradient-to-r ${item.color} shadow-lg` 
                        : 'bg-gray-100'}
                    `}>
                      {isActive ? (
                        <ActiveIcon className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <span className={`
                      text-xs mt-1 font-medium transition-colors duration-300
                      ${isActive ? 'text-gray-800' : 'text-gray-600'}
                    `}>
                      {item.name}
                    </span>
                    {isActive && (
                      <span className={`
                        absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5
                        bg-gradient-to-r ${item.color}
                      `} />
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
