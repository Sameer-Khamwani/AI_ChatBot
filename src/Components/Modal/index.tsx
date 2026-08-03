import React, { FC } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { IModalComponent } from '../../Utils/interface';
import { colors } from '../../Utils/theme';
import Button from '../Button';
import CustomText from '../CustomText';
import { styles } from './styles';

const ModalComponent: FC<IModalComponent> = ({
  open,
  close,
  text,
  buttons,
  children,
  header,
  style,
  buttonStyle,
  textStyle,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={open}
      statusBarTranslucent
      onRequestClose={close}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {close && (
            <TouchableOpacity style={styles.closeButton} onPress={close}>
              <CustomText text="✕" size={16} color={colors.lightText} />
            </TouchableOpacity>
          )}
          <View style={styles.childrenContainer}>
            {header && (
              <CustomText
                text={header}
                size={18}
                weight="bold"
                style={styles.headerText}
              />
            )}
            {text && (
              <CustomText
                style={[styles.modalText, textStyle]}
                text={text}
                size={16}
              />
            )}
          </View>
          {children}
          <View style={[styles.buttonsRow, style]}>
            {buttons?.map((item, index) => (
              <Button
                key={`${item.text}-${index}`}
                text={item.text}
                style={[styles.customButton, buttonStyle, item?.style]}
                onPress={item.onPress}
                buttonType={
                  item?.type
                    ? item?.type
                    : index % 2
                      ? 'secondary'
                      : 'primary'
                }
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalComponent;
