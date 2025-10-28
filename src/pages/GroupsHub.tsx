import { useState, useEffect } from 'react';
import { Plus, Search, Users, Calendar, MapPin, Settings, BarChart3, Trash2 } from 'lucide-react';
import { AddGroupModal, GroupMembersModal } from '../components/modals';
import toast from 'react-hot-toast';

interface Group {
  id: string;
  name: string;
  description: string;
  leader: string;
  members_count: number;
  maxMembers: number;
  schedule: string;
  location: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const initialGroups: Group[] = [
  {
    id: '1',
    name: 'Молодежное служение',
    description: 'Группа для молодых людей 18-30 лет',
    leader: 'Алексей Козлов',
    members_count: 15,
    maxMembers: 25,
    schedule: 'Воскресенье, 19:00',
    location: 'Зал молодежи',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Семейное служение',
    description: 'Группа для семей с детьми',
    leader: 'Мария Сидорова',
    members_count: 8,
    maxMembers: 15,
    schedule: 'Суббота, 16:00',
    location: 'Малый зал',
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Детское служение',
    description: 'Группа для детей 5-12 лет',
    leader: 'Елена Петрова',
    members_count: 22,
    maxMembers: 30,
    schedule: 'Воскресенье, 11:00',
    location: 'Детский зал',
    status: 'active',
    createdAt: '2024-03-10',
  },
];

export default function GroupsHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Загружаем данные из localStorage при инициализации
  useEffect(() => {
    const savedGroups = localStorage.getItem('church-groups');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, []);

  // Сохраняем данные в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('church-groups', JSON.stringify(groups));
  }, [groups]);

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.leader.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddGroup = (groupData: any) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      ...groupData,
      members_count: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setGroups((prev) => [...prev, newGroup]);
    toast.success('Группа успешно создана!');
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту группу?')) {
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
      toast.success('Группа удалена!');
    }
  };

  const handleToggleGroupStatus = (groupId: string) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, status: group.status === 'active' ? 'inactive' : 'active' }
          : group
      )
    );
    toast.success('Статус группы изменен!');
  };

  const handleManageMembers = (group: Group) => {
    setSelectedGroup(group);
    setShowMembersModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Группы и служения</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Управление малыми группами и служениями
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Создать группу
        </button>
      </div>

      {/* Search */}
      <div className="card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск групп..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredGroups.map((group) => (
          <div key={group.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {group.name}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{group.description}</p>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  group.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {group.status === 'active' ? 'Активна' : 'Неактивна'}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users className="mr-2 h-4 w-4" />
                <span>Лидер: {group.leader}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users className="mr-2 h-4 w-4" />
                <span>
                  Участников: {group.members_count}/{group.maxMembers}
                </span>
                <div className="ml-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(group.members_count / group.maxMembers) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{group.schedule}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{group.location}</span>
              </div>
            </div>

            <div className="mt-6 flex space-x-2">
              <button onClick={() => handleManageMembers(group)} className="btn btn-primary flex-1">
                <Settings className="mr-1 h-4 w-4" />
                Управление
              </button>
              <button className="btn btn-secondary">
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleToggleGroupStatus(group.id)}
                className={`btn ${group.status === 'active' ? 'btn-warning' : 'btn-success'}`}
              >
                {group.status === 'active' ? 'Деактивировать' : 'Активировать'}
              </button>
              <button onClick={() => handleDeleteGroup(group.id)} className="btn btn-danger">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Группы не найдены
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      )}

      {/* Модальные окна */}
      <AddGroupModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddGroup}
      />

      {selectedGroup && (
        <GroupMembersModal
          isOpen={showMembersModal}
          onClose={() => {
            setShowMembersModal(false);
            setSelectedGroup(null);
          }}
          group={selectedGroup}
        />
      )}
    </div>
  );
}
