import { format as d3Format } from 'd3-format';
import NumberFormatter from '../NumberFormatter';
import NumberFormats from '../NumberFormats';

const siFormatter = d3Format(`.3~s`);
const float2PointFormatter = d3Format(`.2~f`);
const float4PointFormatter = d3Format(`.4~f`);

function formatValue(value: number) {
  if (value === 0) {
    return '0';
  }
  const absoluteValue = Math.abs(value);

  const units: {
    value: number;
    symbol: string;
  }[] = [
    { value: 1, symbol: '' },
    { value: 1e4, symbol: '万' },
    { value: 1e8, symbol: '亿' },
    { value: 1e12, symbol: '万亿' },
  ];

  // eslint-disable-next-line no-plusplus
  for (let i = units.length - 1; i > 0; i--) {
    if (value >= units[i].value) {
      return `${float2PointFormatter(value / units[i].value)}${
        units[i].symbol
      }`;
    }
  }

  if (absoluteValue >= 0.001) {
    return float4PointFormatter(value);
  }

  if (absoluteValue > 0.000001) {
    return `${siFormatter(value * 1000000)}µ`;
  }
  return siFormatter(value);
}

export default function createZhSmartNumberFormatter(
  config: {
    description?: string;
    signed?: boolean;
    id?: string;
    label?: string;
  } = {},
) {
  const { description, signed = false, id, label } = config;
  const getSign = signed ? (value: number) => (value > 0 ? '+' : '') : () => '';

  return new NumberFormatter({
    description,
    formatFunc: value => `${getSign(value)}${formatValue(value)}`,
    id:
      id || signed
        ? NumberFormats.ZH_SMART_NUMBER_SIGNED
        : NumberFormats.ZH_SMART_NUMBER,
    label: label ?? 'Adaptive formatter',
  });
}
