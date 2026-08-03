import React, { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { formatDate, truncateText } from '../../Utils/helper';
import { IDocumentCard } from '../../Utils/interface';
import colors from '../../Utils/theme';
import CustomText from '../CustomText';
import Row from '../Row';
import { styles } from './styles';

const DocumentCard: FC<IDocumentCard> = ({ item, onPress, onDelete }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={onPress}>
      <Row justifyContent="space-between" alignItems="flex-start">
        <View style={styles.content}>
          <View style={styles.badge}>
            <CustomText
              text={item.fileType.toUpperCase()}
              size={10}
              weight="semibold"
              color={colors.primary}
            />
          </View>
          <CustomText
            text={item.title}
            size={16}
            weight="semibold"
            style={styles.title}
          />
          <CustomText
            text={truncateText(item.summary || item.content, 90)}
            size={12}
            color={colors.lightText}
            lines={2}
            style={styles.summary}
          />
          <CustomText
            text={formatDate(item.createdAt)}
            size={11}
            color={colors.gray}
            style={styles.date}
          />
        </View>
        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <CustomText text="Delete" size={12} color={colors.red} />
          </TouchableOpacity>
        )}
      </Row>
    </TouchableOpacity>
  );
};

export default DocumentCard;
