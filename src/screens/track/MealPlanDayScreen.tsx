import { FC, useCallback, useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Header } from '@components/Header';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { TrackTabStackNavigationScreenProps } from '@navigation/home-tabs/track-tab-stack/track-tab-stack-types';
import { MealPlanItem } from '@db/models/MealPlanItem';
import { useMealPlanDay, useMealPlanDayActions } from './meal-plan-day-hooks';
import { MealItemFormValues, MealSection } from './meal-plan-types';
import { MealSectionCard } from './components/MealSectionCard';
import { MealItemEditBottomSheet } from './components/MealItemEditBottomSheet';
import { MealPlanCreateBottomSheet } from './components/MealPlanCreateBottomSheet';

interface ItemSheetState {
  isVisible: boolean;
  mealId: string | null;
  editingItem: MealPlanItem | null;
}

export const MealPlanDayScreen: FC<TrackTabStackNavigationScreenProps<'MealPlanDay'>> = function (props) {
  const safeAreaStyles = useSafeAreaStyles();
  const { planId } = props.route.params;
  const { plan, sections } = useMealPlanDay(planId);
  const { addMealItem, updateMealItem, deleteMealItem, renamePlan } = useMealPlanDayActions();
  const [itemSheet, setItemSheet] = useState<ItemSheetState>({
    isVisible: false,
    mealId: null,
    editingItem: null,
  });
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const closeItemSheet = useCallback(() => {
    setItemSheet((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const openCreateItem = useCallback((mealId: string) => {
    setItemSheet({ isVisible: true, mealId, editingItem: null });
  }, []);

  const openEditItem = useCallback((item: MealPlanItem) => {
    setItemSheet({ isVisible: true, mealId: item.mealId, editingItem: item });
  }, []);

  const handleSubmitItem = useCallback(
    async (values: MealItemFormValues) => {
      if (itemSheet.editingItem) {
        await updateMealItem(itemSheet.editingItem.id, values);
      } else if (itemSheet.mealId) {
        await addMealItem(itemSheet.mealId, values);
      }
    },
    [itemSheet.editingItem, itemSheet.mealId, addMealItem, updateMealItem]
  );

  const handleDeleteItem = useCallback(
    (item: MealPlanItem) => {
      void deleteMealItem(item.id);
    },
    [deleteMealItem]
  );

  const openRename = useCallback(() => setIsRenameOpen(true), []);
  const closeRename = useCallback(() => setIsRenameOpen(false), []);

  const handleRenameSubmit = useCallback(
    async (name: string) => {
      await renamePlan(planId, name);
    },
    [renamePlan, planId]
  );

  const renderSection = useCallback(
    (section: MealSection) => (
      <MealSectionCard
        key={section.meal.id}
        item={section}
        onPressItem={openEditItem}
        onDeleteItem={handleDeleteItem}
        onAddItem={openCreateItem}
      />
    ),
    [openEditItem, handleDeleteItem, openCreateItem]
  );

  return (
    <View style={safeAreaStyles.pLayoutGrow}>
      <Header
        isBack={true}
        title={plan?.name ?? ''}
        rightElement={
          <ButtonIcon
            icon={IconEnum.Edit}
            variant={'outline'}
            onPress={openRename}
          />
        }
      />
      <KeyboardAwareScrollView
        contentContainerStyle={[
          sharedLayoutStyles.gap12,
          sharedLayoutStyles.pt16,
          sharedLayoutStyles.pb24,
        ]}
        showsVerticalScrollIndicator={false}>
        {sections.map(renderSection)}
      </KeyboardAwareScrollView>
      <MealItemEditBottomSheet
        isVisible={itemSheet.isVisible}
        mode={itemSheet.editingItem ? 'edit' : 'create'}
        initialItem={itemSheet.editingItem}
        onClose={closeItemSheet}
        onSubmit={handleSubmitItem}
      />
      <MealPlanCreateBottomSheet
        isVisible={isRenameOpen}
        mode={'rename'}
        initialName={plan?.name ?? ''}
        onClose={closeRename}
        onSubmit={handleRenameSubmit}
      />
    </View>
  );
};
