import { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { font } from '../../Utils/helper';
import { ICustomText } from '../../Utils/interface';
import { colors } from '../../Utils/theme';
import { styles } from './styles';

const CustomText: FC<ICustomText> = ({
  style,
  weight = 'regular',
  lines,
  text,
  color = colors.white,
  size = 14,
  required,
  requiredStyle,
  textContainer,
  onPress,
  disabled = false,
}) => {
  const fontStyle = {
    fontSize: font(size),
    color,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled ? disabled : onPress ? false : true}
      style={[styles.row, styles.labelContainer, textContainer]}>
      <Text
        numberOfLines={lines}
        allowFontScaling={false}
        style={[style, styles[weight], fontStyle]}>
        {text}
      </Text>
      {required && (
        <Text allowFontScaling={false} style={[styles.required, requiredStyle]}>
          *
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomText;
