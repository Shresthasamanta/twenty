import { IconComponent } from '@/ui/display/icon/types/IconComponent';
import { Toggle } from '@/ui/input/components/Toggle';

import { MenuItemLeftContent } from '../internals/components/MenuItemLeftContent';
import { StyledMenuItemBase } from '../internals/components/StyledMenuItemBase';

type MenuItemToggleProps = {
  LeftIcon?: IconComponent;
  toggled: boolean;
  text: string;
  className: string;
  onToggleChange?: (toggled: boolean) => void;
};

export const MenuItemToggle = ({
  LeftIcon,
  text,
  toggled,
  className,
  onToggleChange,
}: MenuItemToggleProps) => {
  const handleOnClick = () => {
    onToggleChange?.(!toggled);
  };

  return (
    <StyledMenuItemBase className={className} onClick={handleOnClick}>
      <MenuItemLeftContent LeftIcon={LeftIcon} text={text} />
      <Toggle value={toggled} onChange={onToggleChange} />
    </StyledMenuItemBase>
  );
};
