import React, { useEffect, useRef } from 'react'

// Импортируем сам календарь и его обязательные стили.
// Это ключевые строки для его работы.
import Calendar from '@toast-ui/calendar'
import '@toast-ui/calendar/dist/toastui-calendar.min.css'

// Также импортируем наш файл для кастомных стилей
import './Calendar.css'

const CalendarComponent = () => {
  // useRef - это способ получить прямой доступ к HTML-элементу (нашему div)
  // чтобы передать его библиотеке календаря, которая не является React-компонентом.
  const calendarRef = useRef<HTMLDivElement>(null)

  // useEffect с пустым массивом зависимостей [] - это стандартный способ
  // выполнить код один раз после того, как компонент будет отрисован на странице.
  // Идеально для инициализации сторонних библиотек.
  useEffect(() => {
    // Проверяем, что наш div-контейнер уже существует на странице
    if (calendarRef.current) {
      const options = {
        defaultView: 'month',
        useFormPopup: true,
        useDetailPopup: true,
        // Здесь мы позже будем добавлять кастомизацию, языки и другие настройки
      } as const

      // Самый главный момент: создаем экземпляр календаря
      // и говорим ему, в каком div-элементе нужно себя отрисовать.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const calendarInstance = new Calendar(calendarRef.current, options)
    }
  }, []) // Пустой массив означает "выполнить код только при первом рендере"

  return (
    <div className="calendar-wrapper">
      <h1>Календарь</h1>
      {/* 
        Вот тот самый div, который мы используем как контейнер.
        Атрибут 'ref' связывает его с нашим calendarRef в коде.
      */}
      <div id="calendar-container" ref={calendarRef} style={{ height: '800px' }}></div>
    </div>
  )
}

export default CalendarComponent


