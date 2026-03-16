import { FC, useState } from 'react';
import { HomeSection } from '@screens/home/components/HomeSection.tsx';
import { SegmentedControl } from '@ui-kits/SegmentedControl/SegmentedControl.tsx';

interface Props {}

export const HomeSegmentedControl: FC<Props> = function () {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  return (
    <HomeSection title={'Segmented control'}>
      <SegmentedControl
        segments={segments}
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      />
    </HomeSection>
  );
};

const segments = ['First', 'Second', 'Third'];
