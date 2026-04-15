import { FC } from 'react';
import { Typography } from '@ui-kits/Typography/Typography.tsx';

interface HabitFormSectionTitleProps {
  title: string;
}

export const HabitFormSectionTitle: FC<HabitFormSectionTitleProps> = function (props) {
  return (
    <Typography
      size={16}
      weight={700}>
      {props.title}
    </Typography>
  );
};
