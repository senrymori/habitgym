import { FC } from 'react';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonBase } from './ButtonBase';
import { ButtonTextProps } from './button-types';
import { buttonSizeConfig } from './button-consts';
import { useButtonStyles } from './useButtonStyles';

export const ButtonText: FC<ButtonTextProps> = function (props) {
  const { text, textStyle, ...rest } = props;

  const buttonStyles = useButtonStyles(
    props.isStaticColor,
    props.variant,
    props.colorVariant,
    props.disabled,
    props.loading
  );
  const sizeConfig = buttonSizeConfig[props.size ?? 'medium'];

  return (
    <ButtonBase {...rest}>
      <Typography
        size={sizeConfig.fontSize}
        weight={800}
        color={buttonStyles.textColor}
        style={textStyle}>
        {text}
      </Typography>
    </ButtonBase>
  );
};
