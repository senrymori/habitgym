import { FC, useCallback, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { Header } from '@components/Header';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { TrackTabStackNavigationScreenProps } from '@navigation/home-tabs/track-tab-stack/track-tab-stack-types';
import { MealPlanSummary } from './meal-plan-types';
import { useMealPlanActions, useMealPlansList } from './meal-plan-list-hooks';
import { MealPlanCard } from './components/MealPlanCard';
import { MealPlanCreateBottomSheet } from './components/MealPlanCreateBottomSheet';

function keyExtractor(item: MealPlanSummary): string {
  return item.plan.id;
}

export const MealPlanListScreen: FC<TrackTabStackNavigationScreenProps<'MealPlanList'>> = function (props) {
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();
  const summaries = useMealPlansList();
  const { createMealPlan, deleteMealPlan } = useMealPlanActions();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const openCreate = useCallback(() => setIsCreateOpen(true), []);
  const closeCreate = useCallback(() => setIsCreateOpen(false), []);

  const handleCreate = useCallback(
    async (name: string) => {
      const planId = await createMealPlan(name);
      props.navigation.navigate('MealPlanDay', { planId });
    },
    [createMealPlan, props.navigation]
  );

  const handleDelete = useCallback(
    (planId: string) => {
      void deleteMealPlan(planId);
    },
    [deleteMealPlan]
  );

  const renderItem = useCallback<ListRenderItem<MealPlanSummary>>(
    ({ item }) => (
      <MealPlanCard
        item={item}
        onDelete={handleDelete}
      />
    ),
    [handleDelete]
  );

  return (
    <View style={safeAreaStyles.pLayoutGrow}>
      <Header
        title={translations.track.meal.listTitle}
        rightElement={
          <ButtonIcon
            icon={IconEnum.Plus}
            variant={'fill'}
            colorVariant={'primary'}
            onPress={openCreate}
          />
        }
      />
      <FlatList
        data={summaries}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={[sharedLayoutStyles.flex1, sharedLayoutStyles.center, styles.empty]}>
            <Typography colorVariant={'textSecondary'}>{translations.track.meal.emptyList}</Typography>
          </View>
        }
        contentContainerStyle={[
          sharedLayoutStyles.gap12,
          sharedLayoutStyles.flexGrow1,
          sharedLayoutStyles.pt16,
          sharedLayoutStyles.pb16,
        ]}
        showsVerticalScrollIndicator={false}
      />
      <MealPlanCreateBottomSheet
        isVisible={isCreateOpen}
        mode={'create'}
        onClose={closeCreate}
        onSubmit={handleCreate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    minHeight: 240,
  },
});
