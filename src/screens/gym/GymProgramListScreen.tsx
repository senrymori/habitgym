import { FC, useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { Header } from '@components/Header';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { GymTabStackNavigationHookProps } from '@navigation/home-tabs/gym-tab-stack/gym-tab-stack-types';
import { ProgramCard } from './components/ProgramCard';
import { useGymProgramsList } from './gym-program-list-hooks';
import { GymProgramSummary } from './gym-program-detail-types';

function keyExtractor(item: GymProgramSummary): string {
  return item.programId;
}

export const GymProgramListScreen: FC = function () {
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();
  const navigation = useNavigation<GymTabStackNavigationHookProps<'GymProgramList'>>();
  const summaries = useGymProgramsList();

  const handleCreate = useCallback(() => {
    navigation.navigate('GymProgramDetail', {});
  }, [navigation]);

  const renderItem = useCallback<ListRenderItem<GymProgramSummary>>(
    ({ item }) => (
      <ProgramCard
        item={item}
        onStart={() => navigation.navigate('GymWorkoutSetup', { programId: item.programId })}
        onContinue={() =>
          item.activeSessionId &&
          navigation.navigate('GymWorkoutActive', { sessionId: item.activeSessionId })
        }
        onEdit={() => navigation.navigate('GymProgramDetail', { programId: item.programId })}
        onShowHistory={() => navigation.navigate('GymProgramHistory', { programId: item.programId })}
      />
    ),
    [navigation]
  );

  return (
    <View style={[safeAreaStyles.pLayoutGrow, sharedLayoutStyles.gap12]}>
      <Header
        title={translations.gym.programs}
        rightElement={
          <ButtonIcon
            icon={IconEnum.Plus}
            variant={'fill'}
            colorVariant={'primary'}
            onPress={handleCreate}
          />
        }
      />
      <FlatList
        data={summaries}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={[sharedLayoutStyles.flex1, sharedLayoutStyles.center, styles.empty]}>
            <Typography colorVariant={'textSecondary'}>{translations.gym.emptyPrograms}</Typography>
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
