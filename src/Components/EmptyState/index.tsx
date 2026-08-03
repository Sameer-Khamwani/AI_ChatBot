import React, { FC } from 'react';
import { View } from 'react-native';
import { IEmptyState } from '../../Utils/interface';
import colors from '../../Utils/theme';
import Button from '../Button';
import CustomText from '../CustomText';
import { styles } from './styles';

const EmptyState: FC<IEmptyState> = ({
  title,
  subtitle,
  ctaLabel,
  onCtaPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <CustomText text="📄" size={28} />
      </View>
      <CustomText
        text={title}
        size={18}
        weight="semibold"
        style={styles.title}
      />
      <CustomText
        text={subtitle}
        size={13}
        color={colors.lightText}
        style={styles.subtitle}
      />
      {ctaLabel && onCtaPress ? (
        <Button text={ctaLabel} onPress={onCtaPress} style={styles.cta} />
      ) : null}
    </View>
  );
};

export default EmptyState;
