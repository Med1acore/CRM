declare module '@toast-ui/calendar' {
  export type CalendarOptions = any
  export type EventObject = any
  export default class Calendar {
    constructor(container: HTMLElement, options?: CalendarOptions)
    getDate(): Date
    prev(): void
    next(): void
    today(): void
    changeView(viewName: 'month' | 'week' | 'day'): void
    createEvents(events: any[]): void
    updateEvent(id: string, calendarId: string, changes: any): void
    on(eventName: string, handler: (...args: any[]) => void): void
    destroy(): void
  }
}


