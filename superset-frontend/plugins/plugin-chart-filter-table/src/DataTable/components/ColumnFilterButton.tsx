// eslint-disable-next-line import/no-extraneous-dependencies
import { Button, Tooltip } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import Icon from '@ant-design/icons';
import FilterDisabled from '../../images/icons/filter_disabled.svg';
import Filter from '../../images/icons/filter.svg';

export interface ColumnFilterButtonProps {
  showColumnFilter: boolean;
  onClick: () => void;
}

export default function ColumnFilterButton({
  showColumnFilter,
  onClick,
}: ColumnFilterButtonProps) {
  return (
    <Tooltip title={`${showColumnFilter ? 'disable' : 'enable'} column Filter`}>
      <Button
        type="text"
        icon={<Icon component={showColumnFilter ? FilterDisabled : Filter} />}
        onClick={onClick}
      />
    </Tooltip>
  );
}
