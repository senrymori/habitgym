import { FC, useCallback } from 'react';
import { View } from 'react-native';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonUniversal } from '@ui-kits/Button/ButtonUniversal';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { MealPlanItem } from '@db/models/MealPlanItem';
import { MealSection } from '../meal-plan-types';
import { getMealTypeLabel } from '../meal-plan-utils';
import { MealItemRow } from './MealItemRow';

interface MealSectionCardProps {
  item: MealSection;
  onPressItem: (item: MealPlanItem) => void;
  onDeleteItem: (item: MealPlanItem) => void;
  onAddItem: (mealId: string) => void;
}

export const MealSectionCard: FC<MealSectionCardProps> = function (props) {
  const { translations } = useLanguage();
  const handleAdd = useCallback(() => {
    props.onAddItem(props.item.meal.id);
  }, [props.onAddItem, props.item.meal.id]);

  const renderItem = useCallback(
    (item: MealPlanItem) => (
      <MealItemRow
        key={item.id}
        item={item}
        onPress={() => props.onPressItem(item)}
        onDelete={() => props.onDeleteItem(item)}
      />
    ),
    [props.onPressItem, props.onDeleteItem]
  );

  return (
    <Card style={sharedLayoutStyles.gap8}>
      <View style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.gap8]}>
        <Typography
          weight={700}
          size={16}>
          {getMealTypeLabel(props.item.meal.mealType, translations)}
        </Typography>
        <Typography
          weight={600}
          colorVariant={'textSecondary'}>
          {`${Math.round(props.item.totals.calories)} ${translations.track.kcalShort}`}
        </Typography>
      </View>
      {props.item.items.length === 0 ? (
        <Typography
          size={14}
          colorVariant={'textTertiary'}>
          {translations.track.meal.emptySection}
        </Typography>
      ) : (
        <View>{props.item.items.map(renderItem)}</View>
      )}
      <ButtonUniversal
        text={translations.track.meal.addItem}
        icon={IconEnum.Plus}
        size={'small'}
        variant={'outline'}
        colorVariant={'primary'}
        onPress={handleAdd}
      />
    </Card>
  );
};
