import { FC } from 'react';
import { InputText } from '@ui-kits/inputs/InputText.tsx';
import { HomeSection } from '@screens/home/components/HomeSection.tsx';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';
import { TouchableOpacity } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography.tsx';
import { UXTapZone } from '@ui-kits/shared-styles.ts';

export const HomeInputs: FC = function () {
  return (
    <HomeSection title={'Inputs'}>
      <InputText
        label={'With label'}
        placeholder={'Placeholder'}
      />
      <InputText
        label={'With mask'}
        placeholder={'+1'}
        mask={'+999 999 999'}
      />
      <InputText placeholder={'Only placeholder'} />

      <InputText
        placeholder={'With icons'}
        leftIcon={IconEnum.Password}
        rightIcon={IconEnum.Password}
      />
      <InputText
        placeholder={'With Pressable (right icon)'}
        leftIcon={IconEnum.Password}
        rightElement={
          <TouchableOpacity hitSlop={UXTapZone}>
            <Typography icon={IconEnum.Show} />
          </TouchableOpacity>
        }
      />
      <InputText
        disabled={true}
        value={'Disabled'}
      />
      <InputText
        placeholder={'Placeholder'}
        errorText={'Error'}
      />
    </HomeSection>
  );
};
