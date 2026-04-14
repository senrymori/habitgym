import { FC } from 'react';
import { HomeSection } from '@screens/home/components/HomeSection.tsx';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon.tsx';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';
import { View } from 'react-native';

interface Props {}

export const HomeButtonsIcons: FC<Props> = function () {
  return (
    <HomeSection title={'Buttons - Only Icon'}>
      <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap8]}>
        <ButtonIcon icon={IconEnum.BangStar} />
        <ButtonIcon
          icon={IconEnum.BangStar}
          colorVariant={'contrast'}
        />
        <ButtonIcon
          icon={IconEnum.BangStar}
          variant={'outline'}
        />
        <ButtonIcon
          icon={IconEnum.BangStar}
          disabled={true}
        />
        <ButtonIcon
          icon={IconEnum.BangStar}
          loading={true}
        />
      </View>
    </HomeSection>
  );
};
