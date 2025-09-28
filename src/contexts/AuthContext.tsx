import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthUser } from '../types'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase client is not initialized. AuthContext will render as logged-out.')
      setLoading(false)
      return
    }

    // Получаем текущую сессию
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Ошибка при получении сессии:', error)
        } else if (session) {
          setSession(session)
          setUser(transformSupabaseUser(session.user))
        }
      } catch (error) {
        console.error('Ошибка при инициализации аутентификации:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Слушаем изменения аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (session) {
          setSession(session)
          setUser(transformSupabaseUser(session.user))
        } else {
          setSession(null)
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Функция для преобразования пользователя Supabase в наш формат
  const transformSupabaseUser = (supabaseUser: User): AuthUser => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role: (supabaseUser.user_metadata?.role as 'admin' | 'leader' | 'member') || 'member',
      user_metadata: {
        full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'Пользователь'
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Auth service unavailable')

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.user && data.session) {
        setUser(transformSupabaseUser(data.user))
        setSession(data.session)
      }
    } catch (error) {
      console.error('Ошибка входа:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) throw new Error('Auth service unavailable')

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'member'
          }
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.user && data.session) {
        setUser(transformSupabaseUser(data.user))
        setSession(data.session)
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (!supabase) return

    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Ошибка выхода:', error)
      }
      
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Ошибка выхода:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
}