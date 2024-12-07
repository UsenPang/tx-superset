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
import { HistogramTransformedProps } from './types';
import Echart from '../components/Echart';
import { EventHandlers } from '../types';

export default function Histogram(props: HistogramTransformedProps) {
  const {
    height,
    width,
    theme,
    echartInitOpts,
    echartOptions,
    onFocusedSeries,
    onLegendStateChanged,
    refs,
  } = props;

  const eventHandlers: EventHandlers = {
    legendselectchanged: payload => {
      onLegendStateChanged?.(payload.selected);
    },
    legendselectall: payload => {
      onLegendStateChanged?.(payload.selected);
    },
    legendinverseselect: payload => {
      onLegendStateChanged?.(payload.selected);
    },
    mouseout: () => {
      onFocusedSeries(undefined);
    },
    mouseover: params => {
      onFocusedSeries(params.seriesIndex);
    },
  };

  return (
    <Echart
      refs={refs}
      height={height}
      width={width}
      theme={theme}
      echartInitOpts={echartInitOpts}
      echartOptions={echartOptions}
      eventHandlers={eventHandlers}
    />
  );
}
