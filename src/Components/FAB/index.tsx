import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { IFAB } from '../../Utils/interface';
import colors from '../../Utils/theme';
import CustomText from '../CustomText';
import { styles } from './styles';

const FAB: FC<IFAB> = ({ onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.fab}
      onPress={onPress}>
      <CustomText text="+" size={28} weight="bold" color={colors.white} />
    </TouchableOpacity>
  );
};

export default FAB;
