import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  MessageSquare,
  BarChart3,
  LogOut,
  X,
  Bell,
  Sun,
  Moon,
  CheckSquare,
  Calendar as CalendarIcon,
  Brain,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../components/ThemeProvider'
import { RadioPlayer } from '../RadioPlayer'

const navigation = [
  { name: 'Панель управления', href: '/', icon: LayoutDashboard },
  { name: 'Люди', href: '/people', icon: Users },
  { name: 'Группы', href: '/groups', icon: UserCheck },
  { name: 'Календарь', href: '/calendar', icon: CalendarIcon },
  { name: 'Задачи', href: '/tasks', icon: CheckSquare },
  { name: 'Коммуникации', href: '/communications', icon: MessageSquare },
  { name: 'Аналитика', href: '/analytics', icon: BarChart3 },
  { name: 'Улучшить проповедь', href: '/sermon-analyzer', icon: Brain },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col w-64 h-full backdrop-blur-sm border-r shadow-lg bg-white/70 border-gray-200 dark:bg-black/20 dark:border-white/10">
      {/* Header - only visible on desktop */}
      <div className="hidden lg:flex items-center justify-between h-20 px-4 backdrop-blur-sm border-b bg-white/70 border-gray-200 dark:bg-black/20 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <img 
            src="./logo.webp" 
            alt="Father's Home Logo" 
            className="h-8 w-8 rounded-full object-cover"
          />
          <h1 className="text-sm font-bold text-gray-900 dark:text-white font-clash leading-tight">
            Father's<br />Home
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors"
          >
            {theme === 'dark' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile header with close button */}
      <div className="lg:hidden flex items-center justify-between h-16 px-4 backdrop-blur-sm border-b bg-white/70 border-gray-200 dark:bg-black/20 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <img 
            src="./logo.webp" 
            alt="Father's Home Logo" 
            className="h-8 w-8 rounded-full object-cover"
          />
          <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate font-clash">Father's Home</h1>
        </div>
        
        <button
          onClick={onClose}
          className="p-1 rounded-md text-gray-700 hover:bg-gray-100 dark:text-white hover:dark:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-500/10 text-gray-900 border border-blue-500/20 dark:bg-blue-500/20 dark:text-white dark:border-blue-400/30'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Radio Player - встроенный в боковую панель */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-white/10">
        <div className="mb-3">
          <h3 className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">
            Радио
          </h3>
        </div>
        <RadioPlayer
          streamUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Father's Home Radio"
          className="w-full"
          compact={true}
        />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-white/10">
        <div className="flex items-center px-4 py-2 text-sm text-gray-900 dark:text-white/90">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-500/20 dark:bg-blue-500/20 dark:border-blue-400/30 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.user_metadata?.full_name || 'Пользователь'}
            </p>
            <p className="text-xs text-gray-500 dark:text-white/60">
              {user?.role === 'admin' ? 'Администратор' : 
               user?.role === 'leader' ? 'Лидер' : 'Участник'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => signOut()}
          className="flex items-center w-full px-4 py-2 mt-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Выйти
        </button>
      </div>
    </div>
  )
}
