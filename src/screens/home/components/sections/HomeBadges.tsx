import { FC } from 'react';
import { View } from 'react-native';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { Badge, BadgeVariant } from '@ui-kits/Badge.tsx';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';
import { HomeSection } from '@screens/home/components/HomeSection.tsx';

export const HomeBadges: FC = function () {
  return (
    <HomeSection title={'Badges'}>
      <View style={[sharedLayoutStyles.row, sharedLayoutStyles.flexWrap, sharedLayoutStyles.gap8]}>
        <Badge text={'Outline'} />
        <Badge
          variant={BadgeVariant.Fill}
          text={'Fill'}
        />
        <Badge
          isStatusMode={true}
          variant={BadgeVariant.Fill}
          text={'With status'}
        />
        <Badge
          text={'With icon'}
          icon={IconEnum.Time}
        />
      </View>
    </HomeSection>
  );
};
