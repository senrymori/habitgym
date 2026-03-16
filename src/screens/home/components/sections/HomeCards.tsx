import { FC, useState } from 'react';
import { HomeSection } from '@screens/home/components/HomeSection.tsx';
import { Card } from '@ui-kits/Card.tsx';
import { Typography } from '@ui-kits/Typography/Typography.tsx';
import { TouchableOpacity } from 'react-native';
import { sharedLayoutStyles, UXTapZone } from '@ui-kits/shared-styles.ts';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';
import { Collapsible } from '@ui-kits/Collapsible.tsx';

interface Props {}

export const HomeCards: FC<Props> = function () {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  return (
    <HomeSection title={'Cards'}>
      <Card>
        <Typography weight={500}>{'Simple'}</Typography>
        <Typography size={14}>{'Secondary styles'}</Typography>
      </Card>
      <Card variant={'tertiary'}>
        <Typography weight={500}>{'Simple'}</Typography>
        <Typography size={14}>{'tertiary styles'}</Typography>
      </Card>
      <Card>
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={UXTapZone}
          style={sharedLayoutStyles.rowCenterBetween}
          onPress={() => setIsExpanded((prevState) => !prevState)}>
          <Typography weight={500}>{'Collapsible'}</Typography>
          <Typography icon={isExpanded ? IconEnum.ChevronUpOutline : IconEnum.ChevronDownOutline} />
        </TouchableOpacity>
        <Collapsible expanded={isExpanded}>
          <Card
            style={sharedLayoutStyles.mt8}
            variant={'tertiary'}>
            <Typography weight={500}>{'Simple'}</Typography>
            <Typography size={14}>{'tertiary styles'}</Typography>
          </Card>
        </Collapsible>
      </Card>
    </HomeSection>
  );
};
