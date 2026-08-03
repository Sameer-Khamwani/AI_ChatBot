import React, { FC, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { widthPixel } from '../../Utils/helper';
import { ICustomTextInput } from '../../Utils/interface';
import colors from '../../Utils/theme';
import CustomText from '../CustomText';
import Row from '../Row';
import styles from './styles';

const CustomTextInput: FC<ICustomTextInput> = ({
  label,
  required,
  secureTextEntry = false,
  containerStyle,
  disabled,
  textInputContainerStyle,
  onChangeText,
  value,
  placeholder,
  style,
  labelStyle,
  requiredStyle,
  returnKeyType,
  multiline,
  lines,
  keyboardType,
  error,
  editable,
  onPress,
}) => {
  const [showPassword, setShowPassword] = useState(secureTextEntry);
  const isEditable = editable !== undefined ? editable : !disabled;

  const inputProps = {
    editable: isEditable,
    secureTextEntry: showPassword,
    onChangeText,
    returnKeyType: returnKeyType ? returnKeyType : 'default',
    autoCorrect: false,
    keyboardType,
    value,
    placeholder: placeholder ? placeholder : '',
    multiline: multiline ? true : false,
    style: [styles.textInput, multiline && styles.multilineInput, style],
  };

  const Container: any = onPress ? TouchableOpacity : View;
  const containerProps = onPress
    ? { onPress, activeOpacity: 0.8 }
    : { pointerEvents: disabled ? 'none' : undefined };

  return (
    <Container {...containerProps} style={[styles.container, containerStyle]}>
      <Row gap={widthPixel(8)}>
        {label && (
          <View style={[styles.row, styles.labelContainer]}>
            <CustomText
              text={label}
              weight="regular"
              style={[styles.label, labelStyle]}
              lines={lines}
            />
            {required && (
              <Text allowFontScaling style={[styles.required, requiredStyle]}>
                *
              </Text>
            )}
          </View>
        )}
      </Row>
      <View
        style={[
          styles.row,
          styles.textInputContainer,
          multiline && styles.multilineContainer,
          textInputContainerStyle,
        ]}>
        {onPress ? (
          <View style={styles.inputFill} pointerEvents="none">
            <TextInput
              {...inputProps}
              placeholderTextColor={colors.lightText}
            />
          </View>
        ) : (
          <TextInput {...inputProps} placeholderTextColor={colors.lightText} />
        )}
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeView}
            onPress={() => setShowPassword(!showPassword)}>
            <CustomText
              text={showPassword ? 'Show' : 'Hide'}
              size={12}
              color={colors.lightText}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <CustomText
          text={error}
          color={colors.red}
          size={12}
          style={styles.inputErrorSpacing}
        />
      )}
    </Container>
  );
};

export default CustomTextInput;
