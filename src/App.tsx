import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { Layout, ProtectedRoute } from './components'
import Dashboard from './pages/Dashboard'
import { PeopleHubPage } from './features/people/PeopleHubPage'
import GroupsHub from './pages/GroupsHub'
import Communications from './pages/Communications'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import Test from './pages/Test'
import { TasksLobbyPage } from './pages/TasksLobbyPage'
import { BoardPage } from './pages/BoardPage'
import SermonAnalyzerPage from './pages/SermonAnalyzerPage'
import CalendarComponent from './components/Calendar/CalendarComponent'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
            <Route path="/test" element={<Test />} />
            <Route path="/crm/login" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="people" element={<PeopleHubPage />} />
              <Route path="groups" element={<GroupsHub />} />
              <Route path="tasks" element={<TasksLobbyPage />} />
              <Route path="tasks/:boardId" element={<BoardPage />} />
              <Route path="communications" element={<Communications />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="sermon-analyzer" element={<SermonAnalyzerPage />} />
              <Route path="calendar" element={<CalendarComponent />} />
              <Route path="*" element={<Dashboard />} />
            </Route>
        </Routes>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  )
}

export default App