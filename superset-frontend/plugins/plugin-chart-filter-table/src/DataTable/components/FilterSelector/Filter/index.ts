import { ensureIsArray } from '@superset-ui/core';
import {
  MULTI_OPERATORS,
  ONLY_OPERATORS,
  OPERATOR_ENUM_TO_OPERATOR_TYPE,
  Operators,
} from '../constants';

export enum FilterTypes {
  Input = 'INPUT',
  Option = 'OPTION',
}

export interface InputFilter {
  inputValue: string;
}

export interface OptionFilter {
  subject?: string;
  lable?: string;
  operator?: Operators;
  comparator?: string | string[];
  filterOptionName?: string;
}

export default class AdhocFilter implements OptionFilter {
  subject?: string;

  lable?: string;

  operator?: Operators;

  comparator?: string | string[];

  filterOptionName?: string;

  constructor(adhocFilter: OptionFilter) {
    this.subject = adhocFilter.subject;
    this.lable = adhocFilter.lable;
    this.operator = adhocFilter.operator;
    this.comparator = adhocFilter.comparator;
    this.filterOptionName =
      adhocFilter.filterOptionName ||
      `filter_${Math.random().toString(36).substring(2, 15)}_${Math.random()
        .toString(36)
        .substring(2, 15)}`;
  }

  // 复制过滤器
  duplicateWith(nextFields: OptionFilter) {
    return new AdhocFilter({
      ...this,
      ...nextFields,
    });
  }

  equals(adhocFilter: AdhocFilter) {
    if (
      this.subject !== adhocFilter.subject ||
      this.operator !== adhocFilter.operator
    ) {
      return false;
    }

    if (
      this.operator &&
      (MULTI_OPERATORS.has(this.operator) ||
        this.operator === Operators.TemporalRange)
    ) {
      return (
        Array.isArray(this.comparator) &&
        Array.isArray(adhocFilter.comparator) &&
        JSON.stringify(this.comparator.sort()) ===
          JSON.stringify(adhocFilter.comparator.sort())
      );
    }

    return (
      (this.operator && ONLY_OPERATORS.has(this.operator)) ||
      this.comparator === adhocFilter.comparator
    );
  }

  // 验证filter是否正确
  validate() {
    if (!this.subject || !this.operator) {
      return false;
    }

    if (
      MULTI_OPERATORS.has(this.operator) ||
      this.operator === Operators.TemporalRange
    ) {
      return Array.isArray(this.comparator);
    }

    return ONLY_OPERATORS.has(this.operator) || this.comparator;
  }

  getDiaplayLabel() {
    const { subject, lable, operator = '', comparator } = this;
    const operation = OPERATOR_ENUM_TO_OPERATOR_TYPE[operator]?.operation;
    const columnName = lable ?? subject;

    if (!operator || !operation || !subject) {
      return 'Filter Error';
    }

    if (ONLY_OPERATORS.has(operator)) {
      return `${subject} ${operation}`;
    }

    // 时间范围
    if (
      operator === Operators.TemporalRange &&
      Array.isArray(comparator) &&
      comparator.length === 2
    ) {
      const expression = ` ≤ ${columnName} < `;
      return comparator.join(expression);
    }

    const isMulti =
      [...MULTI_OPERATORS]
        .map(op => OPERATOR_ENUM_TO_OPERATOR_TYPE[op].operation)
        .indexOf(operation) >= 0;
    // If returned value is an object after changing dataset
    let expression = columnName ?? '';
    if (columnName && operation) {
      expression += ` ${operation}`;
      const firstValue =
        isMulti && Array.isArray(comparator) ? comparator[0] : comparator;
      const comparatorArray = ensureIsArray(comparator);
      const isString =
        firstValue !== undefined && Number.isNaN(Number(firstValue));
      const quote = isString ? "'" : '';
      const [prefix, suffix] = isMulti ? ['(', ')'] : ['', ''];
      const formattedComparators = comparatorArray.map(
        val =>
          `${quote}${isString ? String(val).replace("'", "''") : val}${quote}`,
      );
      if (comparatorArray.length > 0) {
        expression += ` ${prefix}${formattedComparators.join(', ')}${suffix}`;
      }
    }
    return expression;
  }
}
