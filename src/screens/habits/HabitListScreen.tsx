import { FC } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Habit } from '@db/models/Habit';
import { HabitListHeader } from './components/HabitListHeader';
import { HabitCard } from './components/HabitCard';
import { useHabitsList } from './habits-list-hooks';

const renderItem: ListRenderItem<Habit> = function ({ item }) {
  return <HabitCard item={item} />;
};

function keyExtractor(item: Habit): string {
  return item.id;
}

export const HabitListScreen: FC = function () {
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();
  const habits = useHabitsList();

  return (
    <View style={safeAreaStyles.pLayoutGrow}>
      <FlatList
        data={habits}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={HabitListHeader}
        ListEmptyComponent={
          <View style={[sharedLayoutStyles.flex1, sharedLayoutStyles.center, styles.empty]}>
            <Typography colorVariant={'textSecondary'}>{translations.habits.emptyList}</Typography>
          </View>
        }
        contentContainerStyle={[sharedLayoutStyles.gap12, sharedLayoutStyles.flexGrow1]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    minHeight: 240,
  },
});
