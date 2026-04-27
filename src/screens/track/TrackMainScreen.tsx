import { FC, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { TrackTabStackNavigationScreenProps } from '@navigation/home-tabs/track-tab-stack/track-tab-stack-types';
import { TrackSectionCard } from './components/TrackSectionCard';
import { getTrackSections, TrackSection } from './track-main-consts';

export const TrackMainScreen: FC<TrackTabStackNavigationScreenProps<'TrackMain'>> = function (props) {
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();

  const sections = useMemo(() => getTrackSections(translations), [translations]);

  const renderItem = useCallback(
    function (item: TrackSection) {
      function handlePress() {
        if (item.screen === 'ExerciseList') {
          props.navigation.navigate('ExerciseList', item.params);
        } else {
          props.navigation.navigate(item.screen);
        }
      }

      return (
        <TrackSectionCard
          key={item.id}
          item={item}
          onPress={handlePress}
        />
      );
    },
    [props.navigation]
  );

  return (
    <View style={[safeAreaStyles.pLayoutGrowWithSpace, sharedLayoutStyles.gap12]}>{sections.map(renderItem)}</View>
  );
};
