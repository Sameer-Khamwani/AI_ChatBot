import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Modal, View } from 'react-native';
import { LoaderProps } from '../../Utils/interface';
import { useColors } from '../../Utils/theme';
import CustomText from '../CustomText';
import { styles } from './styles';

const Loader: React.FC<LoaderProps> = ({
  visible = true,
  size = 'large',
  text,
}) => {
  const colors = useColors();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(300);
      opacityAnim.setValue(0);
    }
  }, [visible, slideAnim, opacityAnim]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.loaderBox,
            {
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim,
              backgroundColor: colors.search,
            },
          ]}>
          <ActivityIndicator size={size} color={colors.primary} />
          {text && (
            <CustomText text={text} style={styles.text} color={colors.black} />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default Loader;
