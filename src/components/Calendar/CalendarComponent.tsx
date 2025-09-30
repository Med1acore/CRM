import { useEffect, useRef, useState } from 'react'

// Импортируем сам календарь и его обязательные стили.
// Это ключевые строки для его работы.
import Calendar from '@toast-ui/calendar'
import '@toast-ui/calendar/dist/toastui-calendar.min.css'

// Также импортируем наш файл для кастомных стилей
import './Calendar.css'

// --- НАШИ ТЕСТОВЫЕ ДАННЫЕ С ЯВНЫМ РАЗРЕШЕНИЕМ НА ПЕРЕТАСКИВАНИЕ ---
const initialEvents = [
  {
    id: '1',
    calendarId: 'work',
    title: 'Встреча по проекту',
    category: 'time',
    start: '2025-09-29T10:00:00',
    end: '2025-09-29T11:30:00',
    isDraggable: true,
  },
  {
    id: '2',
    calendarId: 'personal',
    title: 'Обед с клиентом',
    category: 'time',
    start: '2025-09-29T13:00:00',
    end: '2025-09-29T14:00:00',
    isDraggable: true,
  },
  {
    id: '3',
    calendarId: 'work',
    title: 'Подготовить отчет',
    category: 'allday', // событие на весь день
    start: '2025-09-30',
    end: '2025-09-30',
    isDraggable: true,
    isReadOnly: false, // убедимся, что можно редактировать
  },
]

// Помощник для форматирования даты
const getFormattedDateRange = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]
  return `${monthNames[month]} ${year}`
}

const CalendarComponent = () => {
  const calendarRef = useRef<HTMLDivElement>(null)
  // В этот ref мы сохраним сам экземпляр календаря, чтобы иметь к нему доступ из функций
  const calendarInstanceRef = useRef<Calendar | null>(null)

  // Состояние для отображения текущего диапазона дат в шапке
  const [dateRange, setDateRange] = useState('')
  // Состояние для кастомного модала
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    id: '',
    calendarId: 'work',
    title: '',
    location: '',
    start: '',
    end: '',
    allDay: false,
  })

  const toLocalInput = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const yyyy = date.getFullYear()
    const mm = pad(date.getMonth() + 1)
    const dd = pad(date.getDate())
    const hh = pad(date.getHours())
    const mi = pad(date.getMinutes())
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
  }

  useEffect(() => {
    // Inject high-specificity glassmorphism styles once per app lifetime
    const injectCalendarGlassStyles = () => {
      const styleId = 'tui-calendar-glass-styles'
      if (typeof document === 'undefined' || document.getElementById(styleId)) return
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
/* Popup container */
.toastui-calendar-popup-container { color:#111; background:rgba(255,255,255,0.28); border-color:rgba(255,255,255,0.45); border-radius:16px !important; box-shadow:0 10px 30px rgba(0,0,0,0.25),0 1px 0 rgba(255,255,255,0.2) inset; -webkit-backdrop-filter:blur(16px) saturate(150%); backdrop-filter:blur(16px) saturate(150%); }
.toastui-calendar-popup-container .toastui-calendar-popup, .toastui-calendar-popup-container .toastui-calendar-form, .toastui-calendar-popup-container .toastui-calendar-content { background:linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,255,255,0.35)) !important; color:#111 !important; border-radius:16px !important; }
.toastui-calendar-popup-container input, .toastui-calendar-popup-container select, .toastui-calendar-popup-container textarea { background:rgba(255,255,255,0.6) !important; color:#111 !important; border:1px solid rgba(255,255,255,0.6) !important; border-radius:14px !important; padding:10px 12px !important; box-shadow:0 1px 0 rgba(255,255,255,0.7) inset,0 6px 20px rgba(0,0,0,0.08); }
.toastui-calendar-popup-container .toastui-calendar-button-save { background:linear-gradient(180deg,#ff9440,#ff6a00) !important; border-color:rgba(255,255,255,0.6) !important; color:#fff !important; border-radius:14px !important; padding:10px 18px !important; box-shadow:0 10px 24px rgba(255,106,0,0.35),0 1px 0 rgba(255,255,255,0.3) inset; }
.toastui-calendar-popup-container .toastui-calendar-button-cancel { background:rgba(255,255,255,0.45) !important; border:1px solid rgba(255,255,255,0.6) !important; color:#111 !important; border-radius:14px !important; padding:10px 18px !important; }
/* Floating layers */
.toastui-calendar-layer, .toastui-calendar-dropdown-menu { z-index:1000 !important; }
.toastui-calendar-layer, .toastui-calendar-layer * { -webkit-backdrop-filter:blur(14px) saturate(150%) !important; backdrop-filter:blur(14px) saturate(150%) !important; }
.toastui-calendar-layer, .toastui-calendar-layer .toastui-calendar-content, .toastui-calendar-layer .toastui-calendar-item, .toastui-calendar-layer .toastui-calendar-dropdown-menu, .toastui-calendar-layer .toastui-calendar-select-box, .toastui-calendar-layer .toastui-calendar-input, .toastui-calendar-layer .toastui-calendar-timepicker-input, .toastui-calendar-layer .toastui-calendar-timepicker-select, .toastui-calendar-layer .tui-datepicker-input, .toastui-calendar-layer .tui-timepicker-selectbox { background:rgba(255,255,255,0.6) !important; color:#111 !important; border:1px solid rgba(255,255,255,0.6) !important; border-radius:14px !important; box-shadow:0 10px 24px rgba(0,0,0,0.12) !important; }
.toastui-calendar-dropdown-button, .toastui-calendar-dropdown-button .toastui-calendar-content, .toastui-calendar-dropdown, .toastui-calendar-select-box-btn { border-radius:14px !important; background:rgba(255,255,255,0.6) !important; border:1px solid rgba(255,255,255,0.5) !important; box-shadow:0 6px 18px rgba(0,0,0,0.08); }
`
      document.head.appendChild(style)
    }

    if (calendarRef.current) {
      injectCalendarGlassStyles()
      const options = {
        // Все наши предыдущие настройки темы и вида остаются здесь
        defaultView: 'month',
        useFormPopup: false,
        useDetailPopup: false,
        usageStatistics: false,
        calendars: [
          {
            id: 'work',
            name: 'Рабочее',
            backgroundColor: '#515ce6',
            borderColor: '#515ce6',
          },
          {
            id: 'personal',
            name: 'Личное',
            backgroundColor: '#38a169',
            borderColor: '#38a169',
          },
        ],
        theme: {
          common: {
            backgroundColor: 'rgba(30, 30, 30, 1)',
            border: '1px solid #444',
            dayname: { color: '#ccc' },
            holiday: { color: '#f07878' },
            saturday: { color: '#a0a0a0' },
            today: { color: '#fff', backgroundColor: 'rgba(81, 92, 230, 0.5)' },
          },
          month: {
            dayname: { borderLeft: 'none', backgroundColor: 'inherit' },
            day: { color: '#ccc' },
            weekend: { backgroundColor: 'rgba(40, 40, 40, 1)' },
            grid: { border: '1px solid #444', header: { borderBottom: '1px solid #444' } },
          },
        },
      } as const

      const calendar = new Calendar(calendarRef.current, options)
      calendarInstanceRef.current = calendar // Сохраняем экземпляр
      calendar.createEvents(initialEvents)

      updateDateRange() // Устанавливаем заголовок с датой при первой загрузке

      // === ВАЖНЕЙШИЙ БЛОК ДЛЯ РАБОТЫ DRAG-N-DROP ===
      calendar.on('beforeUpdateEvent', ({ event, changes }: any) => {
        // Явно применяем изменения, чтобы не зависать в полуперетаскивании
        calendar.updateEvent(event.id, event.calendarId, changes)
      })

      // Кастомная форма вместо beforeCreateEvent
      calendar.on('selectDateTime', ({ start, end }: any) => {
        setIsEditing(false)
        setForm({
          id: '',
          calendarId: 'work',
          title: '',
          location: '',
          start: toLocalInput(new Date(start)),
          end: toLocalInput(new Date(end)),
          allDay: false,
        })
        setIsModalOpen(true)
      })

      calendar.on('clickEvent', ({ event }: any) => {
        setIsEditing(true)
        setForm({
          id: event.id,
          calendarId: event.calendarId,
          title: event.title || '',
          location: (event as any).location || '',
          start: toLocalInput(new Date(event.start)),
          end: toLocalInput(new Date(event.end)),
          allDay: !!event.isAllday,
        })
        setIsModalOpen(true)
      })
    }
    // Очистка инстанса для совместимости с React
    return () => {
      if (calendarInstanceRef.current) {
        calendarInstanceRef.current.destroy()
        calendarInstanceRef.current = null
      }
    }
  }, [])

  const updateDateRange = () => {
    if (calendarInstanceRef.current) {
      const date = calendarInstanceRef.current.getDate()
      setDateRange(getFormattedDateRange(date))
    }
  }

  const handlePrev = () => {
    calendarInstanceRef.current?.prev()
    updateDateRange()
  }

  const handleNext = () => {
    calendarInstanceRef.current?.next()
    updateDateRange()
  }

  const handleToday = () => {
    calendarInstanceRef.current?.today()
    updateDateRange()
  }
  
  const changeView = (viewName: 'month' | 'week' | 'day') => {
    calendarInstanceRef.current?.changeView(viewName)
  }

  const handleSave = () => {
    if (!calendarInstanceRef.current) return
    if (isEditing) {
      calendarInstanceRef.current.updateEvent(form.id, form.calendarId, {
        title: form.title,
        location: form.location,
        start: new Date(form.start),
        end: new Date(form.end),
        isAllday: form.allDay,
      })
    } else {
      calendarInstanceRef.current.createEvents([
        {
          id: String(Date.now()),
          calendarId: form.calendarId,
          title: form.title,
          location: form.location,
          start: new Date(form.start),
          end: new Date(form.end),
          category: form.allDay ? 'allday' : 'time',
          isDraggable: true,
        },
      ])
    }
    setIsModalOpen(false)
    // Очистить визуальное выделение диапазона после сохранения
    ;(calendarInstanceRef.current as any)?.clearGridSelections?.()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    // Очистить визуальное выделение, если оно осталось после select
    ;(calendarInstanceRef.current as any)?.clearGridSelections?.()
  }

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={handlePrev}>&lt;</button>
          <button onClick={handleNext}>&gt;</button>
          <button onClick={handleToday}>Сегодня</button>
          <span className="current-date-range">{dateRange}</span>
        </div>
        <div className="view-switcher">
          <button onClick={() => changeView('month')}>Месяц</button>
          <button onClick={() => changeView('week')}>Неделя</button>
          <button onClick={() => changeView('day')}>День</button>
        </div>
      </div>
      <div id="calendar-container" ref={calendarRef} style={{ height: '800px' }}></div>

      {isModalOpen && (
        <div className="tui-glass-modal-overlay">
          <div className="tui-glass-modal">
            <div className="tui-glass-modal-header">{isEditing ? 'Редактировать событие' : 'Новое событие'}</div>
            <div className="tui-glass-modal-body">
              <div className="tui-field">
                <label>Заголовок</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="tui-field">
                <label>Локация</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="tui-field-row">
                <div className="tui-field">
                  <label>Начало</label>
                  <input type="datetime-local" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
                </div>
                <div className="tui-field">
                  <label>Конец</label>
                  <input type="datetime-local" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
                </div>
              </div>
              <div className="tui-field-row">
                <label className="tui-checkbox">
                  <input type="checkbox" checked={form.allDay} onChange={(e) => setForm({ ...form, allDay: e.target.checked })} />
                  <span>Весь день</span>
                </label>
              </div>
            </div>
            <div className="tui-glass-modal-footer">
              <button className="btn-cancel" onClick={handleCancel}>Отмена</button>
              <button className="btn-save" onClick={handleSave}>{isEditing ? 'Обновить' : 'Создать'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarComponent


