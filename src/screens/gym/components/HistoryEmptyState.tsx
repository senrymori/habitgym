import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';

export const HistoryEmptyState: FC = function () {
  const { translations } = useLanguage();

  return (
    <View style={[sharedLayoutStyles.flex1, sharedLayoutStyles.center, sharedLayoutStyles.gap12, styles.container]}>
      <Typography
        icon={IconEnum.CalendarFill}
        size={32}
        colorVariant={'textTertiary'}
      />
      <Typography colorVariant={'textSecondary'}>{translations.gym.history.empty}</Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 240,
  },
});
