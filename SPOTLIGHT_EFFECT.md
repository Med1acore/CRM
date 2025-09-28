# ✨ Spotlight Effect для Father's Home Church

## 🎯 Что добавлено

### **Spotlight компонент:**
- Установлен оригинальный `src/components/ui/spotlight-new.tsx` от Aceternity UI
- Анимированный градиентный эффект с motion/react
- Настраиваемые градиенты и анимации

### **Интеграция в Login:**
- Добавлен Spotlight эффект поверх фона
- Градиентный заголовок с `bg-clip-text`
- Grid паттерн для дополнительной текстуры
- Улучшенная типографика

## 🎨 Визуальные эффекты

### **Spotlight эффект (усиленный):**
```tsx
{/* Основной Spotlight */}
<Spotlight 
  gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(270, 100%, 85%, .25) 0, hsla(270, 100%, 55%, .15) 50%, hsla(270, 100%, 45%, .05) 80%)"
  gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(270, 100%, 85%, .20) 0, hsla(270, 100%, 55%, .10) 80%, transparent 100%)"
  gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(270, 100%, 85%, .15) 0, hsla(270, 100%, 45%, .08) 80%, transparent 100%)"
  duration={6}
  xOffset={120}
  translateY={-200}
  width={800}
  height={1600}
  smallWidth={300}
/>

{/* Дополнительный Spotlight */}
<Spotlight 
  gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(330, 100%, 85%, .20) 0, hsla(330, 100%, 55%, .12) 50%, hsla(330, 100%, 45%, .03) 80%)"
  gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(330, 100%, 85%, .15) 0, hsla(330, 100%, 55%, .08) 80%, transparent 100%)"
  gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(330, 100%, 85%, .10) 0, hsla(330, 100%, 45%, .05) 80%, transparent 100%)"
  duration={8}
  xOffset={-80}
  translateY={-150}
  width={600}
  height={1400}
  smallWidth={250}
/>
```

### **Градиентный заголовок (усиленный):**
```tsx
<h1 className="bg-clip-text text-transparent bg-gradient-to-b from-white via-purple-200 to-purple-400 drop-shadow-lg">
  FATHER'S HOME
</h1>
```

### **Свечение логотипа:**
```tsx
<div className="relative">
  <img src="/logo.webp" className="rounded-full shadow-2xl" />
  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-pink-400/30 blur-xl"></div>
</div>
```

### **Grid паттерн:**
```css
.bg-grid-white\/\[0\.02\] {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

## 🏗️ Структура слоев

### **Z-index иерархия:**
1. **Фоновое изображение** (z-index: 0)
2. **Spotlight эффект** (z-index: 0)
3. **Затемнение** (z-index: 1)
4. **Контент** (z-index: 10)

### **CSS классы:**
- `bg-black/[0.96]` - темный фон
- `antialiased` - сглаживание шрифтов
- `bg-grid-white/[0.02]` - тонкий grid паттерн

## 🎨 Настройка Spotlight

### **Цвета:**
```tsx
// Фиолетовый (текущий)
<Spotlight 
  gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(270, 100%, 85%, .08) 0, hsla(270, 100%, 55%, .02) 50%, hsla(270, 100%, 45%, 0) 80%)"
  gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(270, 100%, 85%, .06) 0, hsla(270, 100%, 55%, .02) 80%, transparent 100%)"
  gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(270, 100%, 85%, .04) 0, hsla(270, 100%, 45%, .02) 80%, transparent 100%)"
/>

// Синий
<Spotlight 
  gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)"
  gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)"
  gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)"
/>

// Розовый
<Spotlight 
  gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(330, 100%, 85%, .08) 0, hsla(330, 100%, 55%, .02) 50%, hsla(330, 100%, 45%, 0) 80%)"
  gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(330, 100%, 85%, .06) 0, hsla(330, 100%, 55%, .02) 80%, transparent 100%)"
  gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(330, 100%, 85%, .04) 0, hsla(330, 100%, 45%, .02) 80%, transparent 100%)"
/>
```

### **Анимация:**
```tsx
// Быстрая анимация
<Spotlight duration={5} xOffset={100} />

// Медленная анимация
<Spotlight duration={10} xOffset={30} />

// Без анимации
<Spotlight duration={0} xOffset={0} />
```

### **Размер:**
```tsx
// Большой размер
<Spotlight width={800} height={1600} smallWidth={320} />

// Средний размер (по умолчанию)
<Spotlight width={560} height={1380} smallWidth={240} />

// Маленький размер
<Spotlight width={400} height={1000} smallWidth={180} />
```

## 🧪 Тестирование

### **Проверьте:**
1. **Страница входа:** http://localhost:5173/login
   - Spotlight эффект должен быть виден
   - Градиентный заголовок
   - Grid паттерн на фоне
   - Плавные переходы

2. **Адаптивность:**
   - На мобильных устройствах
   - На планшетах
   - На десктопах

## 🎨 Дополнительные эффекты

### **Анимация Spotlight:**
```css
@keyframes spotlight-move {
  0% { transform: translateX(-100%) translateY(-100%); }
  50% { transform: translateX(100%) translateY(100%); }
  100% { transform: translateX(-100%) translateY(-100%); }
}

.spotlight-animated {
  animation: spotlight-move 10s ease-in-out infinite;
}
```

### **Множественные Spotlight:**
```tsx
<div className="relative">
  <Spotlight className="absolute top-0 left-0" fill="#8b5cf6" />
  <Spotlight className="absolute bottom-0 right-0" fill="#3b82f6" />
  <Spotlight className="absolute top-1/2 left-1/2" fill="#ec4899" />
</div>
```

### **Интерактивный Spotlight:**
```tsx
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

<div 
  onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
  className="relative"
>
  <Spotlight 
    className="absolute"
    style={{
      left: mousePosition.x - 279,
      top: mousePosition.y - 279,
    }}
  />
</div>
```

## 🚀 Результат

Теперь страница входа имеет **ЗАМЕТНЫЙ** анимированный Spotlight эффект:
- ✅ Размытый фоновый рисунок
- ✅ **ДВА** анимированных Spotlight эффекта (фиолетовый + розовый)
- ✅ **Усиленные градиенты** с высокой прозрачностью
- ✅ **Быстрая анимация** (6-8 секунд)
- ✅ **Большие размеры** Spotlight (800x1600px)
- ✅ **Яркий градиентный заголовок** с drop-shadow
- ✅ **Свечение логотипа** с blur эффектом
- ✅ **Уменьшенное затемнение** (10% вместо 20%)
- ✅ Grid паттерн для текстуры
- ✅ Адаптивный дизайн
- ✅ Плавные анимации с motion/react

---

**Статус:** Spotlight эффект теперь **ОЧЕНЬ ЗАМЕТНЫЙ** и драматичный! ✨🔥
