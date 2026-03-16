import { FC } from 'react';
import { HomeSection } from '@screens/home/components/HomeSection.tsx';
import { ButtonUniversal } from '@ui-kits/Button/ButtonUniversal.tsx';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';

interface Props {}

export const HomeButtonsUniversal: FC<Props> = function () {
  return (
    <HomeSection title={'Buttons - Universal'}>
      <ButtonUniversal
        text={'Icon left position'}
        icon={IconEnum.User}
        iconPosition={'left'}
      />
      <ButtonUniversal
        colorVariant={'contrast'}
        text={'Icon right position'}
        icon={IconEnum.ArrowRightOutline}
        iconPosition={'right'}
      />
    </HomeSection>
  );
};
