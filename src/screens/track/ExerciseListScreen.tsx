import { FC, useCallback, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { Typography } from '@ui-kits/Typography/Typography';
import { SegmentedControl } from '@ui-kits/SegmentedControl/SegmentedControl';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { Header } from '@components/Header';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { TrackTabStackNavigationScreenProps } from '@navigation/home-tabs/track-tab-stack/track-tab-stack-types';
import { ExerciseType } from '@db/db-types';
import { GymExercise } from '@db/models/GymExercise';
import { useAllTags, useExercisesList } from './exercise-list-hooks';
import { exerciseTypeSegments } from './exercise-detail-consts';
import { ExerciseListItem } from './components/ExerciseListItem';
import { ExerciseSearchInput } from './components/ExerciseSearchInput';
import { ExerciseTagsFilter } from './components/ExerciseTagsFilter';

function keyExtractor(item: GymExercise): string {
  return item.id;
}

export const ExerciseListScreen: FC<TrackTabStackNavigationScreenProps<'ExerciseList'>> = function (props) {
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();

  const mode = props.route.params.mode;
  const [filterType, setFilterType] = useState<ExerciseType>('strength');
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const exercises = useExercisesList(filterType, searchText, selectedTags);
  const allTags = useAllTags();

  const handleTypeChange = useCallback((index: number) => setFilterType(exerciseTypeSegments[index]), []);

  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }, []);

  const handleAddPress = useCallback(() => {
    props.navigation.navigate('ExerciseDetail', {});
  }, [props.navigation]);

  const handlePressItem = useCallback(
    (id: string) => {
      if (mode === 'select') {
        // Push selected id back to the previous screen via merged route params.
        // Receiver must read selectedExerciseId from its route.params (e.g. via useEffect).
        const state = props.navigation.getState();
        const prevRoute = state?.routes[state.index - 1];
        if (prevRoute) {
          props.navigation.navigate({
            name: prevRoute.name,
            params: { selectedExerciseId: id },
            merge: true,
          } as never);
        }
        props.navigation.goBack();
        return;
      }
      props.navigation.navigate('ExerciseDetail', { exerciseId: id });
    },
    [mode, props.navigation]
  );

  const renderItem = useCallback<ListRenderItem<GymExercise>>(
    ({ item }) => <ExerciseListItem item={item} onPress={() => handlePressItem(item.id)} />,
    [handlePressItem]
  );

  const typeIndex = exerciseTypeSegments.indexOf(filterType);

  return (
    <View style={[safeAreaStyles.pLayoutGrow, sharedLayoutStyles.gap12]}>
      <Header
        title={translations.track.exercise.title}
        rightElement={
          mode === 'edit' ? (
            <ButtonIcon
              icon={IconEnum.Plus}
              variant={'fill'}
              colorVariant={'primary'}
              onPress={handleAddPress}
            />
          ) : undefined
        }
      />
      <SegmentedControl
        segments={[translations.track.exercise.strength, translations.track.exercise.cardio]}
        selectedIndex={typeIndex < 0 ? 0 : typeIndex}
        onChange={handleTypeChange}
      />
      <ExerciseSearchInput
        value={searchText}
        onChange={setSearchText}
      />
      <ExerciseTagsFilter
        allTags={allTags}
        selectedTags={selectedTags}
        onToggle={handleToggleTag}
      />
      <FlatList
        data={exercises}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={[sharedLayoutStyles.flex1, sharedLayoutStyles.center, styles.empty]}>
            <Typography colorVariant={'textSecondary'}>{translations.track.exercise.empty}</Typography>
          </View>
        }
        contentContainerStyle={[sharedLayoutStyles.gap8, sharedLayoutStyles.flexGrow1, sharedLayoutStyles.pb24]}
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
