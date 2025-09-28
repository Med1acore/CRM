# 🎨 ClashDisplay шрифт для Father's Home Church

## ✅ Что настроено

### **Файлы шрифтов:**
- `clash-display-regular.woff2` - обычный вес (400)
- `clash-display-medium.woff2` - средний вес (500)  
- `clash-display-bold.woff2` - жирный вес (700)

### **CSS настройки:**
```css
@font-face {
  font-family: 'ClashDisplay';
  src: url('/fonts/clash-display-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### **Tailwind класс:**
```css
.font-clash {
  font-family: 'ClashDisplay', 'Inter', 'system-ui', 'sans-serif';
}
```

## 🎯 Где используется

### **Страница входа:**
- "FATHER'S HOME" - белый текст с ClashDisplay
- "CHURCH" - светло-фиолетовый текст с ClashDisplay

### **Sidebar:**
- "Father's Home Church" в заголовке

## 🧪 Тестирование

1. **Перезапустите сервер:** `npm run dev`
2. **Откройте:** http://localhost:5173/login
3. **Проверьте:** Название должно отображаться шрифтом ClashDisplay

## 🎨 Дополнительные настройки

### **Использовать в других местах:**
```tsx
<h1 className="font-clash text-2xl font-bold">
  Ваш текст с ClashDisplay
</h1>
```

### **Разные веса шрифта:**
```tsx
// Обычный
<h1 className="font-clash font-normal">Текст</h1>

// Средний
<h1 className="font-clash font-medium">Текст</h1>

// Жирный
<h1 className="font-clash font-bold">Текст</h1>
```

### **Разные размеры:**
```tsx
// Маленький
<h1 className="font-clash text-sm">Текст</h1>

// Средний
<h1 className="font-clash text-lg">Текст</h1>

// Большой
<h1 className="font-clash text-4xl">Текст</h1>
```

## 🔍 Проверка загрузки

### **В DevTools:**
1. Откройте F12 → Network
2. Обновите страницу
3. Найдите файлы `clash-display-*.woff2`
4. Убедитесь, что они загружаются (статус 200)

### **В Elements:**
1. Откройте F12 → Elements
2. Найдите элемент с `font-clash`
3. В Styles должно быть: `font-family: ClashDisplay`

## 🚀 Результат

Теперь "FATHER'S HOME CHURCH" отображается красивым современным шрифтом ClashDisplay! 🎉

---

**Статус:** ClashDisplay успешно настроен и работает! ✅
