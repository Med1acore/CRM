import { Users, UserCheck, Calendar, MessageSquare, TrendingUp, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AddUserModal } from '../components';

const stats = [
  {
    name: 'Всего участников',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Активные группы',
    value: '24',
    change: '+2',
    changeType: 'positive',
    icon: UserCheck,
  },
  {
    name: 'События в этом месяце',
    value: '18',
    change: '+5',
    changeType: 'positive',
    icon: Calendar,
  },
  {
    name: 'Новые участники',
    value: '47',
    change: '+23%',
    changeType: 'positive',
    icon: UserPlus,
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'new_member',
    message: 'Новый участник присоединился к группе "Молодежное служение"',
    time: '2 часа назад',
  },
  {
    id: 2,
    type: 'event',
    message: 'Событие "Воскресное богослужение" запланировано на завтра',
    time: '4 часа назад',
  },
  {
    id: 3,
    type: 'message',
    message: 'Рассылка "Еженедельные новости" отправлена 156 участникам',
    time: '1 день назад',
  },
  {
    id: 4,
    type: 'group',
    message: 'Группа "Семейное служение" провела встречу',
    time: '2 дня назад',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const handleAddUser = (newUser: any) => {
    // TODO: Добавить пользователя в глобальное состояние
    console.log('New user added:', newUser);
  };

  const quickActions = [
    {
      label: 'Добавить нового участника',
      icon: UserPlus,
      onClick: () => setIsAddUserModalOpen(true),
      className: 'btn-primary',
    },
    {
      label: 'Создать событие',
      icon: Calendar,
      onClick: () => navigate('/events'),
      className: 'btn-secondary',
    },
    {
      label: 'Отправить сообщение',
      icon: MessageSquare,
      onClick: () => navigate('/communications'),
      className: 'btn-secondary',
    },
    {
      label: 'Просмотреть аналитику',
      icon: TrendingUp,
      onClick: () => navigate('/analytics'),
      className: 'btn-secondary',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Панель управления</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Обзор ключевых показателей и активности церковного сообщества
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="card p-6 flex flex-col h-full">
          <h3 className="text-lg font-medium text-foreground mb-4">Последняя активность</h3>
          <div className="flex-1 space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-blue-400 rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6 flex flex-col h-full">
          <h3 className="text-lg font-medium text-foreground mb-4">Быстрые действия</h3>
          <div className="flex-1 space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`btn ${action.className} w-full justify-start hover:opacity-90 transition-opacity`}
              >
                <action.icon className="mr-2 h-4 w-4" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </div>
  );
}
