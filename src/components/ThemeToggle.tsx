import { FC } from 'react';
import { useThemeConfig } from '@providers/theme/ThemeConfigProvider';
import { ThemeMode } from '@providers/theme/theme-types.ts';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon.tsx';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';

export const ThemeToggle: FC = function () {
  const { setTheme, isDark } = useThemeConfig();

  return (
    <ButtonIcon
      colorVariant={'contrast'}
      variant={'outline'}
      icon={isDark ? IconEnum.Sun : IconEnum.Moon}
      onPress={() => {
        setTheme(isDark ? ThemeMode.light : ThemeMode.dark);
      }}
    />
  );
};
