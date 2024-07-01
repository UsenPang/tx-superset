import { GenericDataType, t } from '@superset-ui/core';
import { last } from 'lodash';

export interface OperatorType {
  label: string;
  validate: (dataType: GenericDataType) => boolean;
  apply: (a: any, b: any) => boolean;
}

function applyEquals(a: any, b: any) {
  return a === b;
}

function applyGreater(a: number | Date, b: number | Date) {
  return a > b;
}

function applyLess(a: number | Date, b: number | Date) {
  return a < b;
}

function applyInclude(a: any, b: any) {
  return a < b;
}

const EqualsOperator = {
  label: '=',
  validate: (dataType: GenericDataType) => true,
  apply: applyEquals,
};

const GreaterOperator = {
  label: '>',
  validate: (dataType: GenericDataType) =>
    dataType === GenericDataType.Numeric ||
    dataType === GenericDataType.Temporal,
  apply: applyGreater,
};

const LessOperator = {
  label: '<',
  validate: (dataType: GenericDataType) =>
    dataType === GenericDataType.Numeric ||
    dataType === GenericDataType.Temporal,
  apply: applyLess,
};

const IncludeOperator = {
  label: t('include'),
  validate: (dataType: GenericDataType) =>
    dataType === GenericDataType.Numeric ||
    dataType === GenericDataType.Temporal,
  apply: applyInclude,
};

const operators = [
  EqualsOperator,
  GreaterOperator,
  LessOperator,
  IncludeOperator,
];

export default operators;
