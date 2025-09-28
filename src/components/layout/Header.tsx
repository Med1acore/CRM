import { Sun, Moon, Bell, Menu } from 'lucide-react'
import { useTheme } from '../../components/ThemeProvider'

interface HeaderProps {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="h-16 backdrop-blur-sm border-b bg-white/70 border-gray-200 dark:bg-black/20 dark:border-white/10">
      <div className="flex items-center justify-between px-4 py-0 h-full sm:px-6">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white truncate">
            <span className="hidden sm:inline">Добро пожаловать в Father's Home</span>
            <span className="sm:hidden">Father's Home</span>
          </h2>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
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
    </header>
  )
}
