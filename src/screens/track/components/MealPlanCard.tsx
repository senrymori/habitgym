import { FC } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { TrackTabStackNavigationHookProps } from '@navigation/home-tabs/track-tab-stack/track-tab-stack-types';
import { useObserveRecord } from '@utils/hooks/useObserveRecord';
import { MealPlanSummary } from '../meal-plan-types';
import { formatMacros } from '../meal-plan-utils';

interface MealPlanCardProps {
  item: MealPlanSummary;
  onDelete: (planId: string) => void;
}

export const MealPlanCard: FC<MealPlanCardProps> = function (props) {
  const navigation = useNavigation<TrackTabStackNavigationHookProps<'MealPlanList'>>();
  const { translations } = useLanguage();
  const plan = useObserveRecord(props.item.plan);
  const totals = props.item.totals;

  function handlePress() {
    navigation.navigate('MealPlanDay', { planId: plan.id });
  }

  function handleLongPress() {
    Alert.alert(
      translations.track.meal.deletePlanTitle,
      translations.track.meal.deletePlanMessage,
      [
        { text: translations.track.meal.cancel, style: 'cancel' },
        {
          text: translations.track.meal.delete,
          style: 'destructive',
          onPress: () => props.onDelete(plan.id),
        },
      ]
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      onLongPress={handleLongPress}>
      <Card style={sharedLayoutStyles.gap8}>
        <View style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.gap8]}>
          <Typography
            weight={600}
            style={sharedLayoutStyles.flex1}>
            {plan.name}
          </Typography>
          <Typography weight={600}>
            {`${Math.round(totals.calories)} ${translations.track.kcalShort}`}
          </Typography>
        </View>
        <Typography
          size={14}
          colorVariant={'textSecondary'}>
          {formatMacros(totals, translations)}
        </Typography>
      </Card>
    </TouchableOpacity>
  );
};
