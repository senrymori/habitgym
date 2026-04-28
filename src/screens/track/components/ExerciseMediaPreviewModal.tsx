import { FC } from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { MediaFormItem } from '../exercise-detail-types';

interface Props {
  visible: boolean;
  type: 'photo' | 'video';
  item: MediaFormItem | null;
  onClose: () => void;
  onDelete: () => void;
}

export const ExerciseMediaPreviewModal: FC<Props> = function (props) {
  const themeColors = useAppThemeColors();
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();

  function handleDeletePress(): void {
    Alert.alert(
      translations.track.exercise.media.removeConfirmTitle,
      translations.track.exercise.media.removeConfirmMessage,
      [
        { text: translations.track.exercise.cancel, style: 'cancel' },
        {
          text: translations.track.exercise.delete,
          style: 'destructive',
          onPress: () => {
            props.onDelete();
            props.onClose();
          },
        },
      ]
    );
  }

  const uri = props.item?.uri;
  const sourceUri = uri
    ? uri.startsWith('file://') || uri.startsWith('content://')
      ? uri
      : `file://${uri}`
    : undefined;

  return (
    <Modal
      visible={props.visible}
      animationType={'fade'}
      presentationStyle={'fullScreen'}
      onRequestClose={props.onClose}
      statusBarTranslucent={true}>
      <View style={[styles.root, { backgroundColor: themeColors.strongBlack }]}>
        <View style={[safeAreaStyles.pLayoutGrow, sharedLayoutStyles.flex1]}>
          <View style={[styles.header, sharedLayoutStyles.rowCenterBetween]}>
            <Pressable
              onPress={props.onClose}
              hitSlop={12}>
              <Typography
                icon={IconEnum.Close}
                size={24}
                color={themeColors.strongWhite}
              />
            </Pressable>
            <Pressable
              onPress={handleDeletePress}
              hitSlop={12}>
              <Typography
                icon={IconEnum.Trash}
                size={24}
                color={themeColors.strongWhite}
              />
            </Pressable>
          </View>
          <View style={[sharedLayoutStyles.flex1, sharedLayoutStyles.center]}>
            {sourceUri && props.type === 'photo' && (
              <Image
                source={{ uri: sourceUri }}
                style={sharedLayoutStyles.fullLayout}
                resizeMode={'contain'}
              />
            )}
            {sourceUri && props.type === 'video' && (
              <Video
                source={{ uri: sourceUri }}
                style={sharedLayoutStyles.fullLayout}
                controls={true}
                paused={!props.visible}
                resizeMode={'contain'}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    minHeight: 44,
  },
});
