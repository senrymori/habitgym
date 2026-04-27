import { FC, useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { Header } from '@components/Header';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { TrackTabStackNavigationScreenProps } from '@navigation/home-tabs/track-tab-stack/track-tab-stack-types';
import { WeightHistoryEntry } from './weight-progress-types';
import { useWeightActions, useWeightProgress } from './weight-progress-hooks';
import { WeightSummaryCards } from './components/WeightSummaryCards';
import { WeightHistoryCard } from './components/WeightHistoryCard';
import { WeightUpdateBottomSheet } from './components/WeightUpdateBottomSheet';
import { WeightPeriodPicker } from './components/WeightPeriodPicker';

function keyExtractor(item: WeightHistoryEntry): string {
  return item.id;
}

export const WeightProgressScreen: FC<TrackTabStackNavigationScreenProps<'WeightProgress'>> = function () {
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();
  const themeColors = useAppThemeColors();
  const { summary, historyEntries, periodMonth, periodYear, setPeriod } = useWeightProgress();
  const { createWeightEntry } = useWeightActions();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const defaultUnit = summary.current?.unit ?? 'kg';

  const openSheet = useCallback(() => setIsSheetOpen(true), []);
  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  const renderItem = useCallback<ListRenderItem<WeightHistoryEntry>>(
    function ({ item }) {
      const color = resolveDeltaColor(
        item.deltaFromPrevious,
        themeColors.success,
        themeColors.error,
        themeColors.text
      );
      return (
        <WeightHistoryCard
          item={item}
          color={color}
        />
      );
    },
    [themeColors]
  );

  const listHeader = useMemo(
    () => (
      <View style={[sharedLayoutStyles.gap16, sharedLayoutStyles.pt16, sharedLayoutStyles.pb8]}>
        <WeightSummaryCards summary={summary} />
        <ButtonText
          text={translations.track.weight.update}
          variant={'fill'}
          colorVariant={'primary'}
          onPress={openSheet}
        />
        <WeightPeriodPicker
          month={periodMonth}
          year={periodYear}
          onChange={setPeriod}
        />
      </View>
    ),
    [summary, translations, openSheet, periodMonth, periodYear, setPeriod]
  );

  const listEmpty = useMemo(
    () => (
      <View style={[sharedLayoutStyles.center, sharedLayoutStyles.pv24]}>
        <Typography colorVariant={'textSecondary'}>{translations.track.weight.empty}</Typography>
      </View>
    ),
    [translations]
  );

  return (
    <View style={safeAreaStyles.pLayoutGrow}>
      <Header
        isBack={true}
        title={translations.track.weightProgress}
      />
      <FlatList
        data={historyEntries}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        contentContainerStyle={[sharedLayoutStyles.gap12, sharedLayoutStyles.flexGrow1, sharedLayoutStyles.pb16]}
        showsVerticalScrollIndicator={false}
      />
      <WeightUpdateBottomSheet
        isVisible={isSheetOpen}
        onClose={closeSheet}
        defaultUnit={defaultUnit}
        onSubmit={createWeightEntry}
      />
    </View>
  );
};

function resolveDeltaColor(
  delta: number | null,
  positive: string,
  negative: string,
  neutral: string
): string {
  if (delta === null || delta === 0) return neutral;
  return delta > 0 ? positive : negative;
}
