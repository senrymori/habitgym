import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { Translations } from '@providers/language/localized-strings';
import { TrackTabStackParamList } from '@navigation/home-tabs/track-tab-stack/track-tab-stack-types';

interface TrackSectionBase {
  id: string;
  title: string;
  iconName: IconEnum;
}

export type TrackSection =
  | (TrackSectionBase & { screen: 'ExerciseList'; params: TrackTabStackParamList['ExerciseList'] })
  | (TrackSectionBase & { screen: 'WeightProgress'; params?: undefined })
  | (TrackSectionBase & { screen: 'MealPlanList'; params?: undefined });

export function getTrackSections(translations: Translations): TrackSection[] {
  return [
    {
      id: 'exercises',
      title: translations.track.exercises,
      iconName: IconEnum.DumbFill,
      screen: 'ExerciseList',
      params: { mode: 'edit' },
    },
    {
      id: 'weight',
      title: translations.track.weightProgress,
      iconName: IconEnum.ProgressFill,
      screen: 'WeightProgress',
    },
    {
      id: 'meals',
      title: translations.track.meals,
      iconName: IconEnum.FoodFill,
      screen: 'MealPlanList',
    },
  ];
}
