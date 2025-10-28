import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { Layout, ProtectedRoute } from './components';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PeopleHubPage = lazy(() =>
  import('./features/people/PeopleHubPage').then((m) => ({ default: m.PeopleHubPage }))
);
const GroupsHub = lazy(() => import('./pages/GroupsHub'));
const Communications = lazy(() => import('./pages/Communications'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Login = lazy(() => import('./pages/Login'));
const Test = lazy(() => import('./pages/Test'));
const TasksLobbyPage = lazy(() =>
  import('./pages/TasksLobbyPage').then((m) => ({ default: m.TasksLobbyPage }))
);
const BoardPage = lazy(() => import('./pages/BoardPage').then((m) => ({ default: m.BoardPage })));
const SermonAnalyzerPage = lazy(() => import('./pages/SermonAnalyzerPage'));
const CalendarComponent = lazy(() => import('./components/Calendar/CalendarComponent'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/test" element={<Test />} />
            <Route path="/crm/login" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
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
        </Suspense>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;
