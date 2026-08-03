import React, { FC, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  IMessageBubble,
  ISourceChip,
  SourceInput,
} from '../../Utils/interface';
import colors from '../../Utils/theme';
import CustomText from '../CustomText';
import ModalComponent from '../Modal';
import { styles } from './styles';

const normalizeSources = (sources?: SourceInput[]): ISourceChip[] => {
  if (!sources?.length) return [];
  return sources.map((source, index) => {
    if (typeof source === 'string') {
      return {
        id: `src-${index}`,
        label: source,
        snippet: source,
      };
    }
    return source;
  });
};

const MessageBubble: FC<IMessageBubble> = ({ message }) => {
  const isUser = message.role === 'user';
  const chips = useMemo(
    () => normalizeSources(message.sources),
    [message.sources],
  );
  const [activeChip, setActiveChip] = useState<ISourceChip | null>(null);

  return (
    <View
      style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble,
      ]}>
      {!!message.text && (
        <CustomText
          text={message.text}
          size={14}
          color={colors.white}
          style={styles.text}
        />
      )}
      {!!chips.length && (
        <View style={styles.sources}>
          <CustomText
            text="Sources"
            size={11}
            weight="semibold"
            color={colors.optionsColor}
            style={styles.sourcesLabel}
          />
          <View style={styles.chipRow}>
            {chips.map(source => (
              <TouchableOpacity
                key={source.id}
                style={styles.chip}
                onPress={() => setActiveChip(source)}
                activeOpacity={0.8}>
                <CustomText text={source.label} size={10} color={colors.white} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <ModalComponent
        open={Boolean(activeChip)}
        close={() => setActiveChip(null)}
        header={activeChip?.label || 'Source'}
        text={activeChip?.snippet}
        buttons={[
          {
            text: 'Close',
            type: 'primary',
            onPress: () => setActiveChip(null),
          },
        ]}
      />
    </View>
  );
};

export default MessageBubble;
