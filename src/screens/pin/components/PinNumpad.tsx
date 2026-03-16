import { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { NumpadKeyType } from '@screens/pin/pin-types.ts';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';
import { ButtonText } from '@ui-kits/Button/ButtonText.tsx';
import { textStylesShared } from '@ui-kits/Typography/typography-styles.ts';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon.tsx';

interface PinNumpadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onBiometric?: () => void;
}

export const PinNumpad: FC<PinNumpadProps> = function (props) {
  const renderKey = useCallback(
    (item: string, index: number) => {
      if (item.length === 1) {
        // Numbers
        return (
          <ButtonText
            key={index}
            variant={'outline'}
            style={styles.key}
            text={item}
            textStyle={textStylesShared.fs24}
            onPress={() => props.onDigit(item)}
          />
        );
      }
      // Actions: Biometric & Backspace
      if (item === NumpadKeyType.Biometric && !props.onBiometric) {
        return (
          <View
            key={index}
            style={styles.key}
          />
        );
      }
      return (
        <ButtonIcon
          key={index}
          style={styles.key}
          icon={item === NumpadKeyType.Backspace ? IconEnum.ArrowLeftOutline : IconEnum.FaceIdOutline}
          iconSize={item === NumpadKeyType.Backspace ? 24 : 32}
          onPress={item === NumpadKeyType.Backspace ? props.onBackspace : props.onBiometric}
        />
      );
    },
    [props.onDigit]
  );

  return <View style={styles.container}>{numpadKeys.map(renderKey)}</View>;
};

const numpadKeys = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  NumpadKeyType.Biometric,
  '0',
  NumpadKeyType.Backspace,
] as const;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  key: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
