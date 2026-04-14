import { FC, useCallback, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ModalBottomSheet } from '@components/modals/ModalBottomSheet';
import { Typography } from '@ui-kits/Typography/Typography';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { PRESET_EMOJIS } from './emoji-icon-picker-consts';

export interface EmojiIconPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

export const EmojiIconPicker: FC<EmojiIconPickerProps> = function (props) {
  const themeColors = useAppThemeColors();
  const { translations } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [manualValue, setManualValue] = useState('');

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handlePickPreset = useCallback(
    (emoji: string) => {
      props.onChange(emoji);
      setIsOpen(false);
    },
    [props.onChange]
  );

  const handleSubmitManual = useCallback(() => {
    const trimmed = manualValue.trim();
    if (!trimmed) return;
    props.onChange(trimmed);
    setManualValue('');
    setIsOpen(false);
  }, [manualValue, props.onChange]);

  const renderEmoji = useCallback(
    (emoji: string) => (
      <Pressable
        key={emoji}
        onPress={() => handlePickPreset(emoji)}
        style={[styles.emojiCell, sharedLayoutStyles.center]}>
        <Typography size={28}>{emoji}</Typography>
      </Pressable>
    ),
    [handlePickPreset]
  );

  return (
    <>
      <Pressable
        onPress={open}
        style={[
          styles.trigger,
          sharedLayoutStyles.center,
          sharedLayoutStyles.border1,
          { backgroundColor: themeColors.backgroundSecondary, borderColor: themeColors.border },
        ]}>
        <Typography size={28}>{props.value || '＋'}</Typography>
      </Pressable>

      <ModalBottomSheet
        isVisible={isOpen}
        onClose={close}>
        <View style={[sharedLayoutStyles.p16, sharedLayoutStyles.gap16]}>
          <View style={[sharedLayoutStyles.row, sharedLayoutStyles.flexWrap, sharedLayoutStyles.center]}>
            {PRESET_EMOJIS.map(renderEmoji)}
          </View>
          <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap8, sharedLayoutStyles.rowAlignCenter]}>
            <TextInput
              value={manualValue}
              onChangeText={setManualValue}
              placeholder={translations.common.add}
              placeholderTextColor={themeColors.textTertiary}
              style={[
                styles.input,
                sharedLayoutStyles.flex1,
                sharedLayoutStyles.border1,
                sharedLayoutStyles.br8,
                { color: themeColors.text, borderColor: themeColors.border },
              ]}
            />
            <Pressable
              onPress={handleSubmitManual}
              style={[styles.submit, sharedLayoutStyles.center, sharedLayoutStyles.br8, { backgroundColor: themeColors.primary500 }]}>
              <Typography
                weight={500}
                color={themeColors.strongWhite}>
                {translations.common.add}
              </Typography>
            </Pressable>
          </View>
        </View>
      </ModalBottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  emojiCell: {
    width: 44,
    height: 44,
    margin: 2,
  },
  input: {
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  submit: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
