import { FC, useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';

interface ExerciseTagsFilterProps {
  allTags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
}

export const ExerciseTagsFilter: FC<ExerciseTagsFilterProps> = function (props) {
  const themeColors = useAppThemeColors();

  const renderItem = useCallback(
    (tag: string) => {
      const isActive = props.selectedTags.includes(tag);
      const backgroundColor = isActive ? themeColors.primary400 : themeColors.backgroundSecondary;
      const borderColor = isActive ? themeColors.primary400 : themeColors.border;
      const textColor = isActive ? themeColors.strongWhite : themeColors.text;
      return (
        <TouchableOpacity
          key={tag}
          activeOpacity={0.8}
          style={[styles.chip, { backgroundColor, borderColor }]}
          onPress={() => props.onToggle(tag)}>
          <Typography
            size={12}
            weight={600}
            color={textColor}>
            {`#${tag}`}
          </Typography>
        </TouchableOpacity>
      );
    },
    [props.selectedTags, props.onToggle, themeColors]
  );

  if (props.allTags.length === 0) return null;

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[sharedLayoutStyles.gap8, sharedLayoutStyles.rowAlignCenter]}>
      {props.allTags.map(renderItem)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
  },
});
