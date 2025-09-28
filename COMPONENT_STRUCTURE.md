# 📁 Структура компонентов Father's Home Church

## 🎯 Новая организация

### **Структура папок:**
```
src/components/
├── index.ts                 # Главный экспорт всех компонентов
├── layout/                  # Компоненты макета
│   ├── index.ts            # Экспорт layout компонентов
│   ├── Layout.tsx          # Основной макет приложения
│   ├── Header.tsx          # Заголовок приложения
│   ├── Sidebar.tsx         # Боковая панель навигации
│   ├── Logo.tsx            # Логотип приложения
│   └── ProtectedRoute.tsx  # Защищенный маршрут
├── ui/                     # UI компоненты
│   ├── index.ts            # Экспорт UI компонентов
│   ├── Button.tsx          # Кнопка
│   ├── Card.tsx            # Карточка
│   └── spotlight-new.tsx   # Spotlight эффект
├── modals/                 # Модальные окна
│   ├── index.ts            # Экспорт модальных окон
│   ├── AddUserModal.tsx    # Модальное окно добавления пользователя
│   └── AddEventModal.tsx   # Модальное окно добавления события
└── forms/                  # Формы (пока пустая)
```

## 📦 Экспорты

### **Главный экспорт (src/components/index.ts):**
```typescript
// Layout components
export * from './layout'

// UI components
export * from './ui'

// Modal components
export * from './modals'
```

### **Layout компоненты (src/components/layout/index.ts):**
```typescript
export { default as Layout } from './Layout'
export { default as Header } from './Header'
export { default as Sidebar } from './Sidebar'
export { default as Logo } from './Logo'
export { default as ProtectedRoute } from './ProtectedRoute'
```

### **UI компоненты (src/components/ui/index.ts):**
```typescript
export { default as Button } from './Button'
export { default as Card } from './Card'
export { Spotlight } from './spotlight-new'
```

### **Модальные окна (src/components/modals/index.ts):**
```typescript
export { default as AddUserModal } from './AddUserModal'
export { default as AddEventModal } from './AddEventModal'
```

## 🔄 Обновленные импорты

### **App.tsx:**
```typescript
// Было:
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Стало:
import { Layout, ProtectedRoute } from './components'
```

### **Login.tsx:**
```typescript
// Было:
import Logo from '../components/Logo'
import { Spotlight } from '../components/ui/spotlight-new'

// Стало:
import { Logo, Spotlight } from '../components'
```

### **PeopleHub.tsx:**
```typescript
// Было:
import AddUserModal from '../components/modals/AddUserModal'

// Стало:
import { AddUserModal } from '../components'
```

### **EventsSchedule.tsx:**
```typescript
// Было:
import AddEventModal from '../components/modals/AddEventModal'

// Стало:
import { AddEventModal } from '../components'
```

## 🎯 Преимущества новой структуры

### **Организация:**
- ✅ **Логическая группировка** компонентов по назначению
- ✅ **Четкая структура** папок
- ✅ **Централизованные экспорты** через index.ts
- ✅ **Упрощенные импорты** из одного места

### **Масштабируемость:**
- ✅ **Легко добавлять** новые компоненты
- ✅ **Простое перемещение** между категориями
- ✅ **Четкое разделение** ответственности
- ✅ **Удобное тестирование** компонентов

### **Разработка:**
- ✅ **Быстрые импорты** - все из одного места
- ✅ **Автодополнение** в IDE
- ✅ **Легкий рефакторинг** при изменении структуры
- ✅ **Читаемый код** с понятными импортами

## 🚀 Использование

### **Импорт одного компонента:**
```typescript
import { Layout } from '../components'
```

### **Импорт нескольких компонентов:**
```typescript
import { Layout, Header, Sidebar } from '../components'
```

### **Импорт всех компонентов категории:**
```typescript
import { Layout, Header, Sidebar, Logo, ProtectedRoute } from '../components'
```

### **Импорт UI компонентов:**
```typescript
import { Button, Card, Spotlight } from '../components'
```

### **Импорт модальных окон:**
```typescript
import { AddUserModal, AddEventModal } from '../components'
```

## 📝 Добавление новых компонентов

### **1. Создать файл компонента:**
```typescript
// src/components/ui/NewComponent.tsx
export default function NewComponent() {
  return <div>New Component</div>
}
```

### **2. Добавить в index.ts:**
```typescript
// src/components/ui/index.ts
export { default as NewComponent } from './NewComponent'
```

### **3. Использовать в приложении:**
```typescript
import { NewComponent } from '../components'
```

## 🧪 Тестирование

### **Проверьте:**
- ✅ **Все импорты** работают корректно
- ✅ **Компоненты** отображаются правильно
- ✅ **Нет ошибок** в консоли
- ✅ **Автодополнение** работает в IDE

---

**Статус:** Структура компонентов реорганизована! 📁✨
