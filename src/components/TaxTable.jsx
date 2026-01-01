import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Edit2, Filter } from 'lucide-react';

const columnHelper = createColumnHelper();

export const TaxTable = ({ data, onEdit }) => {
  const columns = [
    columnHelper.accessor('name', {
      header: 'Entity',
      cell: info => (
        <span className="font-medium text-indigo-600 cursor-pointer hover:underline">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('gender', {
      header: 'Gender',
      cell: info => {
        const gender = info.getValue();
        // FIXED: Removed the typo 'TBgender'
        const isMale = gender === 'Male';
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isMale ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
          }`}>
            {gender}
          </span>
        );
      },
    }),
    columnHelper.accessor('requestDate', {
      header: 'Request date',
      cell: info => <span className="text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor('country', {
      header: () => (
        <div className="flex items-center gap-2">
          Country 
          <Filter size={14} className="text-indigo-600 cursor-pointer" />
        </div>
      ),
      cell: info => <span className="text-gray-900 font-medium">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (props) => (
        <div className="flex justify-end">
          <button 
            onClick={() => onEdit(props.row.original)}
            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors border border-gray-200 rounded-md hover:border-indigo-200 bg-white"
          >
            <Edit2 size={14} />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-b border-gray-100">
              {headerGroup.headers.map(header => (
                <th 
                  key={header.id} 
                  className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-50">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 text-sm whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};