import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import Sidebar from './Sidebar'
import { useMobileSidebar } from '../../hooks/useMobileSidebar'
import { Spotlight } from '../ui'

export default function Layout() {
  const { sidebarOpen, closeSidebar, setSidebarOpen } = useMobileSidebar()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen antialiased relative overflow-hidden bg-white dark:bg-black/[0.96] bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02]">
      {/* Spotlight эффект - основной */}
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)"
        duration={7}
        xOffset={100}
        translateY={-350}
        width={560}
        height={1380}
        smallWidth={240}
      />

      {/* Spotlight эффект - дополнительный */}
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .05) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .03) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)"
        duration={7}
        xOffset={-100}
        translateY={-350}
        width={560}
        height={1380}
        smallWidth={240}
      />

      {/* Затемнение фона для лучшей читаемости */}
      <div className="absolute inset-0 bg-white/60 dark:bg-black/20" style={{ zIndex: 1 }}></div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Mobile header - only visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-20 backdrop-blur-sm border-b bg-white/70 border-gray-200 dark:bg-black/20 dark:border-white/10">
        <div className="flex items-center justify-between px-4 h-full">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <img 
              src="./logo.webp" 
              alt="Father's Home Logo" 
              className="h-6 w-6 rounded-full object-cover mb-1"
            />
            <h1 className="text-sm font-bold text-gray-900 dark:text-white font-clash">Father's Home</h1>
          </div>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Unified Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        lg:static lg:inset-0 lg:transform-none lg:transition-[width] lg:duration-300 lg:ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${collapsed ? 'lg:w-0' : 'lg:w-64'} lg:overflow-hidden
      `}>
        <Sidebar onClose={closeSidebar} />
      </div>
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col overflow-hidden lg:ml-0 relative z-10 transition-[margin] duration-300 ${collapsed ? '' : ''}`}> 
        <main className="flex-1 overflow-x-hidden overflow-y-auto backdrop-blur-sm pt-20 lg:pt-0 bg-white/70 dark:bg-black/20 flex flex-col">
          <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 flex-1 min-h-0">
            <Outlet />
          </div>
          {/* Bottom branding shown only on desktop; part of scrollable content so it hides while scrolling */}
          <div className="hidden lg:flex items-center justify-center pb-6">
            <div className="flex items-center space-x-3 px-5 py-2.5">
              <img src="./logo.webp" alt="Father's Home Logo" className="h-7 w-7 rounded-full object-cover" />
              <span className="font-bold font-clash text-base sm:text-lg text-gray-900/90 dark:text-white/90">Father's Home Church</span>
            </div>
          </div>
        </main>
      </div>

      {/* Center-left floating toggle for desktop */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center fixed left-3 top-1/2 -translate-y-1/2 z-50 h-10 w-10 rounded-full shadow-md border border-border bg-white/70 dark:bg-black/30 backdrop-blur-sm text-gray-700 dark:text-white hover:opacity-90 transition"
        aria-label={collapsed ? 'Показать панель' : 'Скрыть панель'}
      >
        {collapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
      </button>

      
    </div>
  )
}
