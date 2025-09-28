# 🎨 Настройка логотипа Father's Home Church

## Как добавить ваш логотип

### 1. Размещение файла логотипа

Поместите ваш логотип в папку `public/`:
```
public/
├── logo.png          # Ваш логотип
├── logo.svg          # Или в формате SVG
└── favicon.ico       # Иконка для браузера
```

### 2. Обновление компонента Logo

Откройте файл `src/components/Logo.tsx` и замените содержимое:

```tsx
export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  }

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <img 
        src="/logo.png"  // Путь к вашему логотипу
        alt="Father's Home Church Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  )
}
```

### 3. Обновление favicon

Замените файл `public/vite.svg` на ваш логотип и обновите `index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/your-logo.svg" />
```

### 4. Рекомендации по дизайну

**Для темного фона (страница входа):**
- Используйте светлую версию логотипа
- Формат: PNG с прозрачным фоном или SVG
- Размер: минимум 256x256px для четкости

**Для светлого фона (основное приложение):**
- Используйте темную версию логотипа
- Или логотип, который хорошо смотрится на светлом фоне

### 5. Альтернативные варианты

Если у вас есть логотип в разных цветах, создайте несколько версий:

```tsx
export default function Logo({ size = 'md', className = '', variant = 'light' }: LogoProps & { variant?: 'light' | 'dark' }) {
  const logoSrc = variant === 'light' ? '/logo-light.png' : '/logo-dark.png'
  
  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <img 
        src={logoSrc}
        alt="Father's Home Church Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  )
}
```

### 6. Проверка результата

После добавления логотипа:

1. Перезапустите сервер разработки: `npm run dev`
2. Откройте http://localhost:5173/login
3. Проверьте, что логотип отображается корректно
4. Убедитесь, что логотип хорошо смотрится на фиолетовом фоне

### 7. Оптимизация

Для лучшей производительности:

- Используйте SVG для векторных логотипов
- Сжимайте PNG/JPG файлы
- Создайте несколько размеров для разных экранов
- Используйте WebP формат для современных браузеров

---

**Готово!** Ваш логотип теперь будет отображаться в стиле TanStack с фиолетовым градиентным фоном.
