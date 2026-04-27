import { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { MealPlanItem } from '@db/models/MealPlanItem';
import { useObserveRecord } from '@utils/hooks/useObserveRecord';

interface MealItemRowProps {
  item: MealPlanItem;
  onPress: () => void;
  onDelete: () => void;
}

export const MealItemRow: FC<MealItemRowProps> = function (props) {
  const { translations } = useLanguage();
  const item = useObserveRecord(props.item);
  const macros = translations.track.macros;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}>
      <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap8, sharedLayoutStyles.pv8]}>
        <View style={[sharedLayoutStyles.flex1, sharedLayoutStyles.gap4]}>
          <Typography weight={500}>
            {`${item.productName} ${roundDisplay(item.grams)}${translations.track.meal.gramsShort}`}
          </Typography>
          <Typography
            size={12}
            colorVariant={'textSecondary'}>
            {`${macros.fat} - ${roundDisplay(item.fat)} | ${macros.protein} - ${roundDisplay(item.protein)} | ${macros.carbs} - ${roundDisplay(item.carbs)}`}
          </Typography>
        </View>
        <Typography
          size={14}
          colorVariant={'textSecondary'}>
          {`${roundDisplay(item.calories)} ${translations.track.kcalShort}`}
        </Typography>
        <ButtonIcon
          icon={IconEnum.Trash}
          size={'small'}
          variant={'outline'}
          onPress={props.onDelete}
        />
      </View>
    </TouchableOpacity>
  );
};

function roundDisplay(value: number): number {
  return Math.round(value * 10) / 10;
}
