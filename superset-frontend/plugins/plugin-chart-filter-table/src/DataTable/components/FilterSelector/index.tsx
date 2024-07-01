/* eslint-disable theme-colors/no-literal-colors */
import { useState, useCallback } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Select, Input, Button, Tag, Popover, DatePicker, Space } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SearchOutlined } from '@ant-design/icons';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'antd/dist/antd.css';
import { GenericDataType, styled } from '@superset-ui/core';
import type { RangePickerProps } from 'antd/es/date-picker';
import moment from 'moment';
import { DataColumnMeta } from '../../../types';
import {
  OPERATORS_OPTIONS,
  OPERATOR_ENUM_TO_OPERATOR_TYPE,
  DEFAULT_DATE_FORMAT,
  Operators,
  ONLY_OPERATORS,
  MULTI_OPERATORS,
} from './constants';
import AdhocFilter from './Filter';

const { RangePicker } = DatePicker;

const { Option } = Select;

interface FilterSelectorProps {
  columns: DataColumnMeta[];
  filters: AdhocFilter[];
  onFiltersChange: (filters: AdhocFilter[]) => void;
}

function DateRangePicker(props: {
  filter: AdhocFilter;
  columns: DataColumnMeta[];
  onChange: (changedFilter: AdhocFilter) => void;
}) {
  const { filter, columns, onChange } = props;
  const [sinceDate, untilDate] =
    Array.isArray(filter.comparator) && filter.comparator.length === 2
      ? filter.comparator
      : [];

  const isDateColumn =
    columns.filter(
      col =>
        filter.subject === col.key && col.dataType === GenericDataType.Temporal,
    ).length > 0;

  const handleChange = (
    value: RangePickerProps['value'],
    dateString: [string, string],
  ) => {
    onChange(
      filter.duplicateWith({
        ...filter,
        operator: Operators.TemporalRange,
        comparator: dateString,
      }),
    );
  };

  const datePicker = (
    <RangePicker
      showTime
      showNow={false}
      format={DEFAULT_DATE_FORMAT}
      onChange={handleChange}
      defaultValue={
        !!sinceDate && !!untilDate
          ? [
              moment(sinceDate, DEFAULT_DATE_FORMAT),
              moment(untilDate, DEFAULT_DATE_FORMAT),
            ]
          : undefined
      }
    />
  );

  return isDateColumn ? datePicker : undefined;
}

function PopoverContent(props: {
  filter: AdhocFilter;
  columns: DataColumnMeta[];
  operators?: string[];
  onClose: () => void;
  onFilterEdit: (newFilter: AdhocFilter) => void;
}) {
  const {
    filter: filterProp,
    columns,
    operators,
    onFilterEdit,
    onClose,
  } = props;
  const [filter, setFilter] = useState(filterProp);

  const FilterActionsContainer = styled.div`
    margin-top: ${({ theme }) => theme.gridUnit * 2}px;
  `;

  // 保存过滤器之前需要验证
  const onSave = () => {
    if (filter.validate()) {
      onFilterEdit(filter);
      onClose();
    }
  };

  const onDateChange = (changedFilter: AdhocFilter) => {
    setFilter(changedFilter);
  };

  const subjectSelect = (
    <Select
      style={{ width: '100%', marginBottom: 16 }}
      placeholder="选择列"
      value={filter.subject}
      onChange={value => setFilter(filter.duplicateWith({ subject: value }))}
    >
      {columns.map(col => (
        <Option key={col.key} value={col.key}>
          {col.label || col.key}
        </Option>
      ))}
    </Select>
  );

  const OperandComponent = () => {
    const { operator } = filter;
    if (operator && ONLY_OPERATORS.has(operator)) {
      return undefined;
    }

    if (operator && MULTI_OPERATORS.has(operator)) {
      return (
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="输入过滤值"
          value={filter.comparator}
          onChange={value =>
            setFilter(filter.duplicateWith({ comparator: value }))
          }
        />
      );
    }

    return (
      <Input
        placeholder="输入过滤值"
        value={filter.comparator}
        onChange={e => {
          setFilter(filter.duplicateWith({ comparator: e.target.value }));
        }}
      />
    );
  };

  // TODO: 根据operator切换不同的input组件
  const operatorsAndOperandComponent = (
    <>
      <Select
        style={{ width: '100%', marginBottom: 16 }}
        placeholder="选择操作符"
        value={filter.operator}
        onChange={value =>
          setFilter(
            filter.duplicateWith({
              operator: value,
            }),
          )
        }
      >
        {(operators || OPERATORS_OPTIONS)
          .map((option, index) => ({
            value: option,
            label: OPERATOR_ENUM_TO_OPERATOR_TYPE[option].display,
            key: option,
            order: index,
          }))
          .map(op => (
            <Option {...op}>{op.label}</Option>
          ))}
      </Select>
      {OperandComponent()}
    </>
  );

  const dataPicker = DateRangePicker({
    filter,
    columns,
    onChange: onDateChange,
  });

  return (
    <div style={{ maxWidth: 340 }}>
      {subjectSelect}
      {dataPicker ?? operatorsAndOperandComponent}
      <FilterActionsContainer>
        <Button className="m-r-5" onClick={onClose}>
          取消
        </Button>
        <Button type="primary" onClick={onSave}>
          确认
        </Button>
      </FilterActionsContainer>
    </div>
  );
}

function FilterPopover(props: {
  key?: number | string;
  children: React.ReactNode;
  columns: DataColumnMeta[];
  operators?: string[];
  filter: AdhocFilter;
  onSaveFilter: (editedFilter: AdhocFilter) => void;
}) {
  const { key, columns, operators, filter, onSaveFilter } = props;
  const [visible, setVisible] = useState(false);

  function onClose() {
    setVisible(false);
  }

  function renderContent() {
    return (
      <PopoverContent
        filter={filter}
        columns={columns}
        operators={operators}
        onClose={onClose}
        onFilterEdit={onSaveFilter}
      />
    );
  }

  return (
    <Popover
      key={key}
      placement="bottom"
      trigger="click"
      transitionName=""
      defaultVisible
      visible={visible}
      onVisibleChange={setVisible}
      title="选择过滤条件"
      destroyTooltipOnHide
      content={renderContent}
    >
      {props.children}
    </Popover>
  );
}

function LabelContainer(props: {
  columns: DataColumnMeta[];
  operators?: string[];
  filters: AdhocFilter[];
  onRemoveFilter: (index: number) => void;
  onFiltersEdit: (editedFilter: AdhocFilter) => void;
}) {
  const { columns, operators, filters, onFiltersEdit, onRemoveFilter } = props;
  return (
    <>
      {filters.length > 0 ? (
        <div style={{ display: 'inline-block', paddingLeft: 8 }}>
          {filters.map((filter, index) => (
            <FilterPopover
              key={index}
              columns={columns}
              operators={operators}
              filter={filter}
              onSaveFilter={onFiltersEdit}
            >
              <Tag
                closable
                onClose={e => {
                  e.preventDefault();
                  onRemoveFilter(index);
                }}
              >
                {filter.getDiaplayLabel()}
              </Tag>
            </FilterPopover>
          ))}
        </div>
      ) : undefined}
    </>
  );
}

function InputSearchSelect(props: {
  columns: DataColumnMeta[];
  onSearch: (filter: AdhocFilter) => void;
}) {
  const { columns, onSearch } = props;
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  return (
    <Select<string>
      style={{ width: 200 }}
      placeholder="搜索..."
      showSearch
      showArrow={false}
      filterOption={false}
      bordered={false}
      suffixIcon={<SearchOutlined />}
      open={open}
      value={value}
      onSearch={val => {
        const isOPen = !!val && val.trim() !== '';
        setOpen(isOPen);
        setValue(val);
      }}
      onSelect={val => {
        onSearch(
          new AdhocFilter({
            subject: val,
            operator: Operators.Like,
            comparator: value,
          }),
        );
        setOpen(false);
        setValue('');
      }}
    >
      {columns.map(col => (
        <Option key={col.key} value={col.key}>
          {`${col.label || col.key}: ${value}`}
        </Option>
      ))}
    </Select>
  );
}

const FilterComponent = ({
  columns,
  filters = [],
  onFiltersChange,
}: FilterSelectorProps) => {
  const handleSave = (newFilter: AdhocFilter) => {
    const isNew =
      filters.filter(filter => filter.equals(newFilter)).length === 0;
    if (isNew) {
      onFiltersChange([...filters, newFilter]);
    }
  };

  function onFilterEdit(editedFilter: AdhocFilter) {
    const newFilters = filters.map(value => {
      if (value.filterOptionName === editedFilter.filterOptionName) {
        return editedFilter;
      }
      return value;
    });

    onFiltersChange(newFilters.filter(filter => !filter.equals(editedFilter)));
  }

  function onRemoveFilter(index: number) {
    const currentFilters = filters.filter((_, i) => i !== index);
    onFiltersChange(currentFilters);
  }

  return (
    <div>
      <Space align="center" style={{ border: 'solid 1px #E0E0E0' }}>
        <LabelContainer
          filters={filters}
          onFiltersEdit={onFilterEdit}
          onRemoveFilter={onRemoveFilter}
          columns={columns}
        />
        <FilterPopover
          columns={columns}
          onSaveFilter={handleSave}
          filter={new AdhocFilter({})}
        >
          <Button size="small" type="link">
            + 过滤
          </Button>
        </FilterPopover>
        <InputSearchSelect columns={columns} onSearch={handleSave} />
      </Space>
    </div>
  );
};

export default FilterComponent;
