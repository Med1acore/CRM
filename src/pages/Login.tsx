import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Spotlight, AnimatedButton } from '../components';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast.success('Успешный вход в систему!');
    } catch (error: any) {
      toast.error(error.message || 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-4 px-4 sm:py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      {/* Spotlight с более мягким свечением */}
      <Spotlight
        gradientFirst="radial-gradient(65% 65% at 50% 30%, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.08) 35%, transparent 75%)"
        gradientSecond="radial-gradient(40% 40% at 50% 50%, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.05) 70%, transparent 100%)"
        gradientThird="radial-gradient(35% 35% at 50% 50%, rgba(147, 197, 253, 0.1) 0%, rgba(37, 99, 235, 0.05) 65%, transparent 100%)"
        translateY={-280}
        width={520}
        height={1200}
        smallWidth={220}
        duration={9}
        xOffset={70}
        intensity={0.7}
      />
      <div className="max-w-md w-full space-y-4 sm:space-y-6 lg:space-y-8 relative z-10 bg-black/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10">
        <div className="text-center">
          {/* Логотип в центре */}
          <div className="mx-auto mb-4 sm:mb-6">
            <img
              src="./logo.webp"
              alt="Father's Home Church Logo"
              className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 mx-auto rounded-full object-cover shadow-lg"
            />
          </div>

          {/* Название под логотипом */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-center text-white uppercase tracking-wide font-clash">
              FATHER'S HOME
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400 uppercase tracking-wide mt-1 sm:mt-2 font-clash">
              CHURCH
            </h2>
          </div>

          <p className="mb-6 sm:mb-8 text-center text-xs sm:text-sm text-blue-200 max-w-lg mx-auto">
            Войдите в систему управления церковью
          </p>
        </div>

        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-blue-200 mb-1 sm:mb-2"
              >
                Email адрес
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 sm:py-3 border border-blue-300/30 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="Введите ваш email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-blue-200 mb-1 sm:mb-2"
              >
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 sm:py-3 border border-blue-300/30 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="Введите ваш пароль"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-blue-300 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-blue-300 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <AnimatedButton type="submit" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти в систему'}
            </AnimatedButton>
          </div>

          <div className="text-center">
            <p className="text-xs text-blue-200 mb-1 sm:mb-2">Тестовые данные:</p>
            <p className="text-xs text-blue-200 leading-tight">
              admin@test.com / password (Администратор)
            </p>
            <p className="text-xs text-blue-200 leading-tight">
              leader@test.com / password (Лидер)
            </p>
            <p className="text-xs text-blue-200 leading-tight">
              member@test.com / password (Участник)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
