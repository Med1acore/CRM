import { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { EngagementPie, EngagementFunnelLine } from '../components';
import { TrendingUp, Users, Calendar, MessageSquare, Eye } from 'lucide-react';

const attendanceData = [
  { month: 'Янв', adults: 120, children: 45, guests: 15 },
  { month: 'Фев', adults: 135, children: 52, guests: 18 },
  { month: 'Мар', adults: 142, children: 48, guests: 22 },
  { month: 'Апр', adults: 138, children: 55, guests: 20 },
  { month: 'Май', adults: 155, children: 62, guests: 25 },
  { month: 'Июн', adults: 148, children: 58, guests: 28 },
];

const membershipData = [
  { month: 'Янв', total: 180, new: 8 },
  { month: 'Фев', total: 188, new: 12 },
  { month: 'Мар', total: 195, new: 10 },
  { month: 'Апр', total: 202, new: 15 },
  { month: 'Май', total: 215, new: 18 },
  { month: 'Июн', total: 228, new: 16 },
];

const engagementPie = [
  { id: 'Гости', value: 45 },
  { id: 'Новые участники', value: 32 },
  { id: 'Активные участники', value: 28 },
];

const insights = [
  {
    type: 'warning',
    title: 'Снижение посещаемости молодежи',
    description: 'За последние 2 недели посещаемость молодежного служения снизилась на 15%',
    suggestion: 'Рекомендуется связаться с лидером группы и провести дополнительную мотивацию',
  },
  {
    type: 'success',
    title: 'Рост новых участников',
    description:
      'В этом месяце присоединилось на 20% больше новых участников по сравнению с прошлым месяцем',
    suggestion: 'Отличная работа! Продолжайте привлекать новых людей через существующие программы',
  },
  {
    type: 'info',
    title: 'Высокая активность в группах',
    description: 'Средняя посещаемость малых групп составляет 85%, что выше целевого показателя',
    suggestion: 'Рассмотрите возможность создания дополнительных групп для новых участников',
  },
];

/**
 * Analytics dashboard with charts, metrics and insights.
 */
export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [analyticsData, setAnalyticsData] = useState({
    totalAttendance: 228,
    newMembers: 16,
    activeEvents: 18,
    sentMessages: 47,
    attendanceGrowth: 12,
    membershipGrowth: 8,
    eventsGrowth: 3,
    messagesGrowth: 15,
  });

  // Загружаем данные из localStorage и вычисляем реальную аналитику
  useEffect(() => {
    const messages = JSON.parse(localStorage.getItem('church-messages') || '[]');
    const people = JSON.parse(localStorage.getItem('church-people') || '[]');
    const events = JSON.parse(localStorage.getItem('church-events') || '[]');

    // Вычисляем реальные метрики
    const totalMembers = people.length;
    const newMembersThisMonth = people.filter((person: any) => {
      const joinDate = new Date(person.joinDate || person.createdAt);
      const now = new Date();
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return joinDate >= monthAgo;
    }).length;

    const sentMessages = messages.filter((msg: any) => msg.status === 'sent').length;

    setAnalyticsData({
      totalAttendance: totalMembers,
      newMembers: newMembersThisMonth,
      activeEvents: events.length,
      sentMessages: sentMessages,
      attendanceGrowth: Math.floor(Math.random() * 20) + 5, // Имитация роста
      membershipGrowth: Math.floor(Math.random() * 15) + 3,
      eventsGrowth: Math.floor(Math.random() * 10) + 1,
      messagesGrowth: Math.floor(Math.random() * 25) + 5,
    });
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '📊';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-400/30 bg-yellow-500/20';
      case 'success':
        return 'border-green-400/30 bg-green-500/20';
      case 'info':
        return 'border-blue-400/30 bg-blue-500/20';
      default:
        return 'border-white/20 bg-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Аналитика и инсайты</h1>
          <p className="mt-2 text-white/80">Визуализация данных и аналитические отчеты</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input"
          >
            <option value="1month">1 месяц</option>
            <option value="3months">3 месяца</option>
            <option value="6months">6 месяцев</option>
            <option value="1year">1 год</option>
          </select>
          <button className="btn btn-secondary">
            <Eye className="mr-2 h-4 w-4" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Общая посещаемость</p>
              <p className="text-2xl font-semibold text-white">{analyticsData.totalAttendance}</p>
              <p className="text-sm text-green-400">+{analyticsData.attendanceGrowth}% за месяц</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Рост участников</p>
              <p className="text-2xl font-semibold text-white">{analyticsData.newMembers}</p>
              <p className="text-sm text-green-400">+{analyticsData.membershipGrowth}% за месяц</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Активные события</p>
              <p className="text-2xl font-semibold text-white">{analyticsData.activeEvents}</p>
              <p className="text-sm text-blue-400">+{analyticsData.eventsGrowth} за месяц</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Отправлено сообщений</p>
              <p className="text-2xl font-semibold text-white">{analyticsData.sentMessages}</p>
              <p className="text-sm text-purple-400">+{analyticsData.messagesGrowth} за месяц</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Attendance Trend */}
        <div className="card p-6 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-white mb-4">Динамика посещаемости</h3>
          <EngagementFunnelLine
            data={[
              { id: 'Взрослые', data: attendanceData.map((d) => ({ x: d.month, y: d.adults })) },
              { id: 'Дети', data: attendanceData.map((d) => ({ x: d.month, y: d.children })) },
              { id: 'Гости', data: attendanceData.map((d) => ({ x: d.month, y: d.guests })) },
            ]}
          />
        </div>

        {/* Membership Growth */}
        <div className="card p-6 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-white mb-4">Рост численности</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={membershipData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3B82F6" name="Общее количество" />
                <Bar dataKey="new" fill="#10B981" name="Новые участники" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Engagement Funnel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-white mb-4">Воронка вовлеченности</h3>
          <EngagementPie data={engagementPie} />
        </div>

        {/* Smart Insights */}
        <div className="card p-6 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-white mb-4">Умные подсказки</h3>
          <div className="flex-1 space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border backdrop-blur-sm ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start">
                  <span className="text-lg mr-3">{getInsightIcon(insight.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{insight.title}</h4>
                    <p className="mt-1 text-sm text-white/80">{insight.description}</p>
                    <p className="mt-2 text-sm font-medium text-white/90">
                      💡 {insight.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
