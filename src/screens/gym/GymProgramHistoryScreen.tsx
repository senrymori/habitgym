import { FC, useCallback, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { addMonths, startOfMonth, subMonths } from 'date-fns';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { Header } from '@components/Header';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { GymTabStackNavigationScreenProps } from '@navigation/home-tabs/gym-tab-stack/gym-tab-stack-types';
import { HistoryCard } from './components/HistoryCard';
import { HistoryMonthPicker } from './components/HistoryMonthPicker';
import { HistoryEmptyState } from './components/HistoryEmptyState';
import { useGymProgramHistory } from './gym-program-history-hooks';
import { HistoryItem } from './gym-program-history-types';

function keyExtractor(item: HistoryItem): string {
  return item.sessionId;
}

const renderItem: ListRenderItem<HistoryItem> = function ({ item }) {
  return <HistoryCard item={item} />;
};

export const GymProgramHistoryScreen: FC<GymTabStackNavigationScreenProps<'GymProgramHistory'>> = function ({ route }) {
  const programId = route.params.programId;
  const safeAreaStyles = useSafeAreaStyles();
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => startOfMonth(new Date()));
  const { program, items, isReady } = useGymProgramHistory(programId, visibleMonth);

  const handlePrev = useCallback(() => setVisibleMonth((d) => subMonths(d, 1)), []);
  const handleNext = useCallback(() => setVisibleMonth((d) => addMonths(d, 1)), []);

  return (
    <View style={[safeAreaStyles.ptPhLayout, sharedLayoutStyles.flex1, sharedLayoutStyles.gap12]}>
      <Header
        isBack={true}
        title={program?.title ?? ''}
      />
      <HistoryMonthPicker
        visibleMonth={visibleMonth}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={isReady ? <HistoryEmptyState /> : null}
        contentContainerStyle={[sharedLayoutStyles.gap12, sharedLayoutStyles.pv16, sharedLayoutStyles.flexGrow1]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
