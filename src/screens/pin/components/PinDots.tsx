import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider.tsx';
import { PIN_LENGTH } from '../pin-consts.ts';

interface Props {
  filledCount: number;
  hasError?: boolean;
}

export const PinDots: FC<Props> = function (props) {
  const themeColors = useAppThemeColors();

  return (
    <View style={styles.container}>
      {Array.from({ length: PIN_LENGTH }, (_, i) => {
        const isFilled = i < props.filledCount;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: props.hasError ? themeColors.error : isFilled ? themeColors.primary400 : 'transparent',
                borderColor: props.hasError
                  ? themeColors.error
                  : isFilled
                  ? themeColors.primary400
                  : themeColors.border,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
});
