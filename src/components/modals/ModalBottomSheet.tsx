import { FC, PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';

export interface ModalBottomSheetProps extends PropsWithChildren {
  isVisible: boolean;
  onClose: () => void;
  snapPoints?: (string | number)[];
}

export const ModalBottomSheet: FC<ModalBottomSheetProps> = function(props) {
  const { isVisible, onClose, children, snapPoints } = props;
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const themeColors = useAppThemeColors();

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible]);

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={onClose}
      />
    ),
    [onClose],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      backdropComponent={renderBackdrop}
      onDismiss={onClose}
      backgroundStyle={[styles.background, { backgroundColor: themeColors.background }]}
      handleIndicatorStyle={[styles.handle, { backgroundColor: themeColors.border }]}>
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});
