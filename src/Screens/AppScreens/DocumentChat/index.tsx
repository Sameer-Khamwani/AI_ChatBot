import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppWrapper from '../../../Components/AppWrapper';
import Button from '../../../Components/Button';
import CustomText from '../../../Components/CustomText';
import MessageBubble from '../../../Components/MessageBubble';
import { goBack } from '../../../Utils/navigation';
import colors from '../../../Utils/theme';
import useDocumentChatController from './useDocumentChatController';
import { styles } from './styles';

const DocumentChat = () => {
  const { values, functions } = useDocumentChatController();

  if (!values.document) {
    return (
      <AppWrapper>
        <View style={styles.notFound}>
          <CustomText
            text="Document not found"
            size={18}
            weight="semibold"
            style={styles.notFoundTitle}
          />
          <CustomText
            text="It may have been deleted from your library."
            size={13}
            color={colors.lightText}
            style={styles.notFoundSubtitle}
          />
          <Button
            text="Back to Library"
            onPress={goBack}
            style={styles.notFoundButton}
          />
        </View>
      </AppWrapper>
    );
  }

  return (
    <AppWrapper paddingHorizontal={0} disableScrollWrapper disableBottomPadding>
      <View style={styles.container}>
        <View style={styles.docBanner}>
          <CustomText
            text={values.document.title}
            size={13}
            weight="semibold"
            color={colors.primary}
            lines={1}
          />
          <CustomText
            text={
              values.useRealApi
                ? 'Mode: Real API (RAG)'
                : 'Mode: Mock replies'
            }
            size={11}
            color={colors.lightText}
          />
        </View>

        <FlatList
          ref={values.flatListRef}
          data={values.messages}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={functions.scrollToBottom}
          renderItem={({ item }) => <MessageBubble message={item} />}
          ListFooterComponent={
            <>
              {values.showSuggestions ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.suggestionsRow}>
                  {values.suggestions.map(item => (
                    <TouchableOpacity
                      key={item}
                      style={styles.suggestionChip}
                      onPress={() => functions.handleSuggestion(item)}>
                      <CustomText
                        text={item}
                        size={12}
                        color={colors.white}
                        weight="semibold"
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : null}
              {values.sending && values.awaitingFirstToken ? (
                <View style={styles.typing}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <CustomText
                    text="Thinking..."
                    size={12}
                    color={colors.lightText}
                  />
                </View>
              ) : null}
            </>
          }
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask about this document..."
            placeholderTextColor={colors.lightText}
            value={values.inputText}
            onChangeText={functions.setInputText}
            multiline
            maxLength={values.maxQuestionLength}
            editable={!values.sending}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!values.inputText.trim() || values.sending) &&
                styles.sendDisabled,
            ]}
            disabled={!values.inputText.trim() || values.sending}
            onPress={functions.handleSend}>
            <CustomText
              text="Send"
              size={13}
              weight="semibold"
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </AppWrapper>
  );
};

export default DocumentChat;
