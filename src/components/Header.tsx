import { FC, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon.tsx';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';
import { Typography } from '@ui-kits/Typography/Typography.tsx';
import { useNavigation } from '@react-navigation/native';

interface Props {
  isBack?: boolean;
  title?: string;
  leftElement?: ReactElement;
  rightElement?: ReactElement;
}

export const Header: FC<Props> = function (props) {
  const navigation = useNavigation();
  return (
    <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap16]}>
      {props.isBack && (
        <ButtonIcon
          icon={IconEnum.ChevronLeftOutline}
          colorVariant={'contrast'}
          onPress={() => navigation.goBack()}
        />
      )}
      {props.leftElement}
      {props.title && (
        <View style={styles.title}>
          <Typography
            align={'center'}
            weight={800}>
            {props.title}
          </Typography>
        </View>
      )}
      {props.rightElement}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    ...sharedLayoutStyles.fullLayout,
    ...sharedLayoutStyles.center,
    position: 'absolute',
  },
});
