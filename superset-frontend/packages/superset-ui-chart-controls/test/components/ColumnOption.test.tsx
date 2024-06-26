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
import { isValidElement } from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { GenericDataType } from '@superset-ui/core';

import { ColumnOption, ColumnOptionProps, ColumnTypeLabel } from '../../src';
import { SQLPopover } from '../../src/components/SQLPopover';

describe('ColumnOption', () => {
  const defaultProps: ColumnOptionProps = {
    column: {
      column_name: 'foo',
      verbose_name: 'Foo',
      expression: 'SUM(foo)',
      description: 'Foo is the greatest column of all',
    },
    showType: false,
  };

  let wrapper: ShallowWrapper;
  let props: ColumnOptionProps;
  const factory = (o: ColumnOptionProps) => <ColumnOption {...o} />;
  beforeEach(() => {
    wrapper = shallow(factory(defaultProps));
    props = { ...defaultProps };
  });
  it('is a valid element', () => {
    expect(isValidElement(<ColumnOption {...defaultProps} />)).toBe(true);
  });
  it('shows a label with verbose_name', () => {
    const lbl = wrapper.find('.option-label');
    expect(lbl).toHaveLength(1);
    expect(lbl.first().text()).toBe('Foo');
  });
  it('shows SQL Popover trigger', () => {
    expect(wrapper.find(SQLPopover)).toHaveLength(1);
  });
  it('shows a label with column_name when no verbose_name', () => {
    delete props.column.verbose_name;
    wrapper = shallow(factory(props));
    expect(wrapper.find('.option-label').first().text()).toBe('foo');
  });
  it('shows a column type label when showType is true', () => {
    wrapper = shallow(
      factory({
        ...props,
        showType: true,
        column: {
          column_name: 'foo',
          type: 'VARCHAR',
          type_generic: GenericDataType.String,
        },
      }),
    );
    expect(wrapper.find(ColumnTypeLabel)).toHaveLength(1);
  });
  it('column with expression has correct column label if showType is true', () => {
    props.showType = true;
    wrapper = shallow(factory(props));
    expect(wrapper.find(ColumnTypeLabel)).toHaveLength(1);
    expect(wrapper.find(ColumnTypeLabel).props().type).toBe('expression');
  });
  it('shows no column type label when type is null', () => {
    wrapper = shallow(
      factory({
        ...props,
        showType: true,
        column: {
          column_name: 'foo',
        },
      }),
    );
    expect(wrapper.find(ColumnTypeLabel)).toHaveLength(0);
  });
  it('dttm column has correct column label if showType is true', () => {
    props.showType = true;
    props.column.expression = undefined;
    props.column.type_generic = GenericDataType.Temporal;
    wrapper = shallow(factory(props));
    expect(wrapper.find(ColumnTypeLabel)).toHaveLength(1);
    expect(wrapper.find(ColumnTypeLabel).props().type).toBe(
      GenericDataType.Temporal,
    );
  });
});
