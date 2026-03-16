import { FC } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonBase } from './ButtonBase';
import { ButtonIconProps } from './button-types';
import { iconOnlySizeConfig } from './button-consts';
import { useButtonStyles } from './useButtonStyles';

export const ButtonIcon: FC<ButtonIconProps> = function (props) {
  const { icon, style, ...rest } = props;

  const buttonStyles = useButtonStyles(
    props.isStaticColor,
    props.variant,
    props.colorVariant,
    props.disabled as boolean,
    props.loading
  );
  const sizeConfig = iconOnlySizeConfig[props.size ?? 'medium'];

  const iconButtonStyle: ViewStyle = {
    width: sizeConfig.width,
    height: sizeConfig.height,
    paddingHorizontal: 0,
  };

  return (
    <ButtonBase
      style={StyleSheet.flatten([iconButtonStyle, style])}
      {...rest}>
      <Typography
        icon={icon}
        size={props.iconSize ?? sizeConfig.iconSize}
        color={buttonStyles.textColor}
      />
    </ButtonBase>
  );
};
