import React, { FC, isValidElement } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { IButton } from '../../Utils/interface';
import colors from '../../Utils/theme';
import CustomText from '../CustomText';
import { styles } from './styles';

const Button: FC<IButton> = ({
  onPress,
  text,
  children,
  style,
  size = 14,
  textStyle,
  weight = 'semibold',
  buttontextcolor,
  buttonType = 'primary',
  loader,
  buttonLoader,
  loading,
  loaderColor,
  disabled,
  primaryStyle,
}) => {
  const isLoading = Boolean(loader ?? buttonLoader ?? loading);
  const isDisabled = disabled || isLoading;
  const label = text ?? (typeof children === 'string' ? children : undefined);
  const hasCustomContent =
    !label && children != null && isValidElement(children);

  const buttonTextColor =
    buttontextcolor ??
    (buttonType === 'primary' ? colors.white : colors.white);

  const resolvedLoaderColor =
    loaderColor ??
    (buttonType === 'primary' ? colors.white : colors.primary);

  const renderLabel = () => {
    if (isLoading) {
      return <ActivityIndicator size="small" color={resolvedLoaderColor} />;
    }
    if (hasCustomContent) {
      return children;
    }
    if (!label) {
      return null;
    }
    return (
      <View style={styles.contentRow}>
        <CustomText
          size={size}
          style={[styles.labelText, textStyle]}
          text={label}
          weight={weight}
          color={buttonTextColor}
        />
      </View>
    );
  };

  return (
    <TouchableOpacity
      disabled={isDisabled}
      activeOpacity={0.6}
      onPress={onPress}
      style={[
        buttonType === 'secondary' && styles.secondaryButtonContainer,
        styles.buttonHeight,
        style,
      ]}>
      {buttonType === 'primary' ? (
        <LinearGradient
          colors={['#6366F1', '#818CF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            disabled && styles.disabledOverlay,
            styles.primaryButtonContainer,
            primaryStyle,
          ]}>
          {renderLabel()}
        </LinearGradient>
      ) : (
        <View
          style={[
            disabled && styles.disabledOverlay,
            styles.secondaryInnerContainer,
            primaryStyle,
          ]}>
          {renderLabel()}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
