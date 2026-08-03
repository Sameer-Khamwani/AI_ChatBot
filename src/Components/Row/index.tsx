import React, { FC, memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IRow } from '../../Utils/interface';
import { styles } from './style';

const Row: FC<IRow> = ({
  justifyContent = 'flex-start',
  alignItems = 'center',
  children,
  style,
  gap,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={onPress ? false : true}>
      <View
        style={[
          styles.rowContainer,
          {
            justifyContent,
            alignItems,
            gap,
          },
          style,
        ]}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

export default memo(Row);
