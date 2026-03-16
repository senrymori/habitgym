import { FC } from 'react';
import { View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography.tsx';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon.tsx';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';
import { ThemeToggle } from '@components/ThemeToggle.tsx';

interface Props {
  onProfilePress: () => void;
}

export const HomeHeader: FC<Props> = function (props) {
  return (
    <View style={sharedLayoutStyles.rowCenterBetween}>
      <ButtonIcon
        colorVariant={'contrast'}
        variant={'outline'}
        icon={IconEnum.UserOutline}
        onPress={props.onProfilePress}
      />
      <Typography
        size={18}
        weight={700}>
        {'Template'}
      </Typography>
      <ThemeToggle />
    </View>
  );
};
