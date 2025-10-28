import type { Person } from '@/types/person';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<Person>();

export const columns = [
  columnHelper.accessor('fullName', {
    header: 'ФИО',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Статус',
    cell: (info) => <span className="p-2 bg-primary/20 rounded-md text-xs">{info.getValue()}</span>,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('phone', {
    header: 'Телефон',
    cell: (info) => info.getValue(),
  }),
];
