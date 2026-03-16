import { FC, Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonBase } from './ButtonBase';
import { ButtonUniversalProps } from './button-types';
import { buttonSizeConfig } from './button-consts';
import { useButtonStyles } from './useButtonStyles';

export const ButtonUniversal: FC<ButtonUniversalProps> = function (props) {
  const { text, icon, iconPosition = 'left', textStyle, ...rest } = props;

  const buttonStyles = useButtonStyles(
    props.isStaticColor,
    props.variant,
    props.colorVariant,
    props.disabled as boolean,
    props.loading
  );
  const sizeConfig = buttonSizeConfig[props.size ?? 'medium'];

  return (
    <ButtonBase {...rest}>
      <View style={styles.contentContainer}>
        {iconPosition === 'left' && (
          <Fragment>
            <Typography
              icon={icon}
              size={sizeConfig.iconSize}
              color={buttonStyles.textColor}
            />
            <View style={styles.iconSpacing} />
          </Fragment>
        )}
        <Typography
          size={sizeConfig.fontSize}
          weight={800}
          color={buttonStyles.textColor}
          style={textStyle}>
          {text}
        </Typography>
        {iconPosition === 'right' && (
          <Fragment>
            <View style={styles.iconSpacing} />
            <Typography
              icon={icon}
              size={sizeConfig.iconSize}
              color={buttonStyles.textColor}
            />
          </Fragment>
        )}
      </View>
    </ButtonBase>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSpacing: {
    width: 8,
  },
});
