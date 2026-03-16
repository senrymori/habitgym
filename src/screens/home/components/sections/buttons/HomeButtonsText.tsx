import { FC } from 'react';
import { HomeSection } from '@screens/home/components/HomeSection.tsx';
import { ButtonText } from '@ui-kits/Button/ButtonText.tsx';

interface Props {}

export const HomeButtonsText: FC<Props> = function () {
  return (
    <HomeSection title={'Buttons - Only Text'}>
      <ButtonText text={'Fill - default'} />
      <ButtonText
        text={'Fill - contrast'}
        colorVariant={'contrast'}
      />
      <ButtonText
        text={'Outline'}
        variant={'outline'}
      />
      <ButtonText
        text={'Disabled'}
        disabled={true}
      />
      <ButtonText
        text={'Loading'}
        loading={true}
      />
    </HomeSection>
  );
};
