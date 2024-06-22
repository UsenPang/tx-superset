/* eslint-disable react/button-has-type */
// eslint-disable-next-line no-restricted-syntax
import React, { useState, ChangeEvent } from 'react';
import { Row, FilterValue, IdType } from 'react-table';
import useAsyncState from '../utils/useAsyncState';

export interface FilterCondition {
  id: IdType<any>;
  value: FilterValue;
}

interface MultiColumnFilterProps<D extends object> {
  preGlobalFilteredRows: Row<D>[];
  columns: IdType<D>[];
  setAllFilters: (filters: FilterCondition[]) => void;
}

const MultiColumnFilter = <D extends object>({
  preGlobalFilteredRows,
  columns,
  setAllFilters,
}: MultiColumnFilterProps<D>) => {
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  const handleAddFilter = () => {
    setFilters([...filters, { id: columns[0], value: '' }]);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = filters.slice();
    newFilters.splice(index, 1);
    setFilters(newFilters);
    setAllFilters(newFilters);
  };

  const handleChangeFilter = (
    index: number,
    field: 'id' | 'value',
    value: string,
  ) => {
    const newFilters = filters.slice();
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
    setAllFilters(newFilters);
  };

  return (
    <div>
      {filters.map((filter, index) => (
        <div key={index} className="filter-row">
          <select
            value={filter.id}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleChangeFilter(index, 'id', e.target.value)
            }
          >
            {columns.map(column => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
          <input
            value={filter.value}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChangeFilter(index, 'value', e.target.value)
            }
          />
          <button onClick={() => handleRemoveFilter(index)}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddFilter}>Add Filter</button>
    </div>
  );
};

export default MultiColumnFilter;
