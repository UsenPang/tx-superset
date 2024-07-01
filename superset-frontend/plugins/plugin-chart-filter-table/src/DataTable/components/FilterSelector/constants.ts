/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { t } from '@superset-ui/core';
import { set } from 'lodash';

export enum Operators {
  Equals = 'EQUALS',
  NotEquals = 'NOT_EQUALS',
  LessThan = 'LESS_THAN',
  LessThanOrEqual = 'LESS_THAN_OR_EQUAL',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEqual = 'GREATER_THAN_OR_EQUAL',
  In = 'IN',
  NotIn = 'NOT_IN',
  Like = 'LIKE',
  CaseInsensitiveLike = 'ILIKE',
  IsNotNull = 'IS_NOT_NULL',
  IsNull = 'IS_NULL',
  IsTrue = 'IS_TRUE',
  IsFalse = 'IS_FALSE',
  TemporalRange = 'TEMPORAL_RANGE',
}

export interface OperatorType {
  display: string;
  operation: string;
}

export const OPERATOR_ENUM_TO_OPERATOR_TYPE: {
  [key in Operators]: OperatorType;
} = {
  [Operators.Equals]: { display: t('Equal to (=)'), operation: '=' },
  [Operators.NotEquals]: { display: t('Not equal to (≠)'), operation: '≠' },
  [Operators.LessThan]: { display: t('Less than (<)'), operation: '<' },
  [Operators.LessThanOrEqual]: {
    display: t('Less or equal (<=)'),
    operation: '<=',
  },
  [Operators.GreaterThan]: { display: t('Greater than (>)'), operation: '>' },
  [Operators.GreaterThanOrEqual]: {
    display: t('Greater or equal (>=)'),
    operation: '>=',
  },
  [Operators.In]: { display: t('In'), operation: 'In' },
  [Operators.NotIn]: { display: t('Not in'), operation: 'Not In' },
  [Operators.Like]: { display: t('Like'), operation: 'LIKE' },
  [Operators.CaseInsensitiveLike]: {
    display: t('Like (case insensitive)'),
    operation: 'ILIKE',
  },
  [Operators.IsNotNull]: {
    display: t('Is not null'),
    operation: t('Is not null'),
  },
  [Operators.IsNull]: { display: t('Is null'), operation: t('Is null') },
  [Operators.IsTrue]: { display: t('Is true'), operation: t('Is true') },
  [Operators.IsFalse]: { display: t('Is false'), operation: t('Is false') },
  [Operators.TemporalRange]: {
    display: t('TEMPORAL_RANGE'),
    operation: 'TEMPORAL_RANGE',
  },
};

export const OPERATORS_OPTIONS = Object.values(Operators) as Operators[];

export const MULTI_OPERATORS = new Set([Operators.In, Operators.NotIn]);

export const ONLY_OPERATORS = new Set([
  Operators.Like,
  Operators.CaseInsensitiveLike,
  Operators.IsTrue,
  Operators.IsFalse,
  Operators.IsNull,
  Operators.IsNotNull,
]);

export const CUSTOM_OPERATORS = new Set([Operators.TemporalRange]);
// DISABLE_INPUT_OPERATORS will disable filter value input
// in adhocFilter control
export const DISABLE_INPUT_OPERATORS = [
  Operators.IsNotNull,
  Operators.IsNull,
  Operators.IsTrue,
  Operators.IsFalse,
];

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
