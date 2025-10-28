import { useState } from 'react';
import { X, Users, Plus, Search, UserMinus, UserCheck } from 'lucide-react';

interface GroupMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: {
    id: string;
    name: string;
    members_count: number;
    maxMembers?: number;
  };
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  joinDate: string;
  role: 'member' | 'leader' | 'assistant';
}

// Mock данные участников
const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Алексей Козлов',
    email: 'alexey@example.com',
    phone: '+7 (999) 123-45-67',
    status: 'active',
    joinDate: '2024-01-15',
    role: 'leader',
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    email: 'maria@example.com',
    phone: '+7 (999) 234-56-78',
    status: 'active',
    joinDate: '2024-02-20',
    role: 'assistant',
  },
  {
    id: '3',
    name: 'Дмитрий Волков',
    email: 'dmitry@example.com',
    phone: '+7 (999) 345-67-89',
    status: 'active',
    joinDate: '2024-03-10',
    role: 'member',
  },
  {
    id: '4',
    name: 'Анна Морозова',
    email: 'anna@example.com',
    phone: '+7 (999) 456-78-90',
    status: 'active',
    joinDate: '2024-03-25',
    role: 'member',
  },
  {
    id: '5',
    name: 'Елена Петрова',
    email: 'elena@example.com',
    phone: '+7 (999) 567-89-01',
    status: 'inactive',
    joinDate: '2024-01-30',
    role: 'member',
  },
];

// Доступные для добавления участники
const availableMembers = [
  {
    id: '6',
    name: 'Игорь Смирнов',
    email: 'igor@example.com',
    phone: '+7 (999) 678-90-12',
  },
  {
    id: '7',
    name: 'Ольга Кузнецова',
    email: 'olga@example.com',
    phone: '+7 (999) 789-01-23',
  },
  {
    id: '8',
    name: 'Сергей Попов',
    email: 'sergey@example.com',
    phone: '+7 (999) 890-12-34',
  },
];

/**
 * Modal window for viewing and managing group members.
 */
export default function GroupMembersModal({ isOpen, onClose, group }: GroupMembersModalProps) {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableFilteredMembers = availableMembers.filter(
    (member) =>
      !members.some((m) => m.id === member.id) &&
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRemoveMember = (memberId: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== memberId));
  };

  const handleToggleMemberStatus = (memberId: string) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
          : member
      )
    );
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleAddSelectedMembers = () => {
    const newMembers = availableMembers
      .filter((member) => selectedMembers.includes(member.id))
      .map((member) => ({
        ...member,
        status: 'active' as const,
        joinDate: new Date().toISOString().split('T')[0],
        role: 'member' as const,
      }));

    setMembers((prev) => [...prev, ...newMembers]);
    setSelectedMembers([]);
    setShowAddMembers(false);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'leader':
        return 'Лидер';
      case 'assistant':
        return 'Помощник';
      case 'member':
        return 'Участник';
      default:
        return 'Участник';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'leader':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'assistant':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'member':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Участники группы "{group.name}"
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {members.length} из {group.maxMembers || '∞'} участников
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Поиск и действия */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск участников..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <button onClick={() => setShowAddMembers(!showAddMembers)} className="btn btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Добавить участников
            </button>
          </div>

          {/* Добавление участников */}
          {showAddMembers && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Доступные участники
              </h3>
              <div className="space-y-2">
                {availableFilteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => handleSelectMember(member.id)}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {member.email} • {member.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedMembers.length > 0 && (
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setSelectedMembers([]);
                      setShowAddMembers(false);
                    }}
                    className="btn btn-secondary"
                  >
                    Отмена
                  </button>
                  <button onClick={handleAddSelectedMembers} className="btn btn-primary">
                    Добавить выбранных ({selectedMembers.length})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Список участников */}
          <div className="space-y-3">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{member.name}</p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.role)}`}
                      >
                        {getRoleLabel(member.role)}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          member.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {member.status === 'active' ? 'Активен' : 'Неактивен'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.email} • {member.phone}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Присоединился: {new Date(member.joinDate).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleMemberStatus(member.id)}
                    className={`p-2 rounded-lg ${
                      member.status === 'active'
                        ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                        : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                    title={member.status === 'active' ? 'Деактивировать' : 'Активировать'}
                  >
                    {member.status === 'active' ? (
                      <UserMinus className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                  </button>
                  {member.role !== 'leader' && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title="Удалить из группы"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                Участники не найдены
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Попробуйте изменить параметры поиска
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
