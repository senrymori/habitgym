import { FC, useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { InputText } from '@ui-kits/inputs/InputText';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { useAllTags } from '../exercise-list-hooks';

interface ExerciseTagsAutocompleteProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export const ExerciseTagsAutocomplete: FC<ExerciseTagsAutocompleteProps> = function (props) {
  const themeColors = useAppThemeColors();
  const { translations } = useLanguage();
  const allTags = useAllTags();
  const [text, setText] = useState('');

  const trimmed = text.trim();
  const trimmedLower = trimmed.toLocaleLowerCase();

  const suggestions = useMemo(() => {
    if (trimmed.length === 0) return [];
    return allTags.filter((tag) => {
      if (props.value.includes(tag)) return false;
      return tag.toLocaleLowerCase().includes(trimmedLower);
    });
  }, [allTags, props.value, trimmed, trimmedLower]);

  const exactExists = useMemo(() => {
    if (trimmed.length === 0) return true;
    if (props.value.some((tag) => tag.toLocaleLowerCase() === trimmedLower)) return true;
    return allTags.some((tag) => tag.toLocaleLowerCase() === trimmedLower);
  }, [allTags, props.value, trimmed, trimmedLower]);

  const addTag = useCallback(
    (tag: string) => {
      const next = Array.from(new Set([...props.value, tag]));
      props.onChange(next);
      setText('');
    },
    [props.value, props.onChange]
  );

  const removeTag = useCallback(
    (tag: string) => {
      props.onChange(props.value.filter((t) => t !== tag));
    },
    [props.value, props.onChange]
  );

  const renderSelectedChip = useCallback(
    (tag: string) => (
      <TouchableOpacity
        key={tag}
        activeOpacity={0.8}
        style={[styles.chip, { backgroundColor: themeColors.primary400, borderColor: themeColors.primary400 }]}
        onPress={() => removeTag(tag)}>
        <Typography
          size={12}
          weight={600}
          color={themeColors.strongWhite}>
          {`#${tag} ×`}
        </Typography>
      </TouchableOpacity>
    ),
    [themeColors, removeTag]
  );

  const renderSuggestion = useCallback(
    (tag: string) => (
      <TouchableOpacity
        key={tag}
        activeOpacity={0.8}
        style={[styles.chip, { backgroundColor: themeColors.backgroundSecondary, borderColor: themeColors.border }]}
        onPress={() => addTag(tag)}>
        <Typography
          size={12}
          weight={600}
          color={themeColors.text}>
          {`#${tag}`}
        </Typography>
      </TouchableOpacity>
    ),
    [themeColors, addTag]
  );

  return (
    <View style={sharedLayoutStyles.gap8}>
      {props.value.length > 0 && (
        <View style={[sharedLayoutStyles.row, sharedLayoutStyles.flexWrap, sharedLayoutStyles.gap8]}>
          {props.value.map(renderSelectedChip)}
        </View>
      )}
      <InputText
        label={translations.track.exercise.tags}
        value={text}
        onChangeText={setText}
        placeholder={translations.track.exercise.tagsPlaceholder}
        autoCapitalize={'none'}
      />
      {trimmed.length > 0 && (
        <View style={[sharedLayoutStyles.row, sharedLayoutStyles.flexWrap, sharedLayoutStyles.gap8]}>
          {suggestions.map(renderSuggestion)}
          {!exactExists && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.chip,
                { backgroundColor: themeColors.success + '20', borderColor: themeColors.success },
              ]}
              onPress={() => addTag(trimmed)}>
              <Typography
                size={12}
                weight={600}
                color={themeColors.success}>
                {`${translations.track.exercise.createTag}: #${trimmed}`}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
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
