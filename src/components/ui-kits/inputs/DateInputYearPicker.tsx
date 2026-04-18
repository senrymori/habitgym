import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { ListRenderItem, Pressable, StyleSheet } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { YEAR_COLUMN_COUNT, YEAR_ITEM_HEIGHT, YEAR_RANGE_BEFORE } from './date-input-consts';

interface DateInputYearPickerProps {
  isVisible: boolean;
  currentYear: number;
  selectedYear: number;
  onSelect: (year: number) => void;
  onClose: () => void;
}

interface YearItemProps {
  year: number;
  isSelected: boolean;
  onSelect: (year: number) => void;
}

const YearItem: FC<YearItemProps> = function (props) {
  const themeColors = useAppThemeColors();

  const handlePress = useCallback(() => props.onSelect(props.year), [props.year, props.onSelect]);

  return (
    <Pressable
      onPress={handlePress}
      style={styles.item}>
      <Typography
        size={18}
        weight={props.isSelected ? 600 : 400}
        color={props.isSelected ? themeColors.primary400 : themeColors.text}>
        {String(props.year)}
      </Typography>
    </Pressable>
  );
};

export const DateInputYearPicker: FC<DateInputYearPickerProps> = function (props) {
  const themeColors = useAppThemeColors();
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (props.isVisible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [props.isVisible]);

  const years = useMemo(() => {
    const from = props.currentYear - YEAR_RANGE_BEFORE;
    const result: number[] = [];
    for (let y = props.currentYear; y >= from; y--) {
      result.push(y);
    }
    return result;
  }, [props.currentYear]);

  const initialScrollIndex = useMemo(() => {
    const index = years.indexOf(props.selectedYear);
    if (index < 0) return 0;
    return Math.floor(index / YEAR_COLUMN_COUNT);
  }, [years, props.selectedYear]);

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={props.onClose}
      />
    ),
    [props.onClose]
  );

  const renderItem: ListRenderItem<number> = useCallback(
    ({ item }) => (
      <YearItem
        year={item}
        isSelected={item === props.selectedYear}
        onSelect={props.onSelect}
      />
    ),
    [props.selectedYear, props.onSelect]
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<number> | null | undefined, rowIndex: number) => ({
      length: YEAR_ITEM_HEIGHT,
      offset: YEAR_ITEM_HEIGHT * rowIndex,
      index: rowIndex,
    }),
    []
  );

  const keyExtractor = useCallback((item: number) => String(item), []);

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      onDismiss={props.onClose}
      enableContentPanningGesture={false}
      backgroundStyle={[styles.background, { backgroundColor: themeColors.background }]}
      handleIndicatorStyle={[styles.handle, { backgroundColor: themeColors.border }]}>
      <BottomSheetFlatList
        data={years}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={YEAR_COLUMN_COUNT}
        initialScrollIndex={initialScrollIndex}
        getItemLayout={getItemLayout}
        contentContainerStyle={[sharedLayoutStyles.pb24, styles.list]}
      />
    </BottomSheetModal>
  );
};

const snapPoints = ['60%'];

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
  list: {
    paddingHorizontal: 24,
  },
  item: {
    flex: 1,
    height: YEAR_ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
