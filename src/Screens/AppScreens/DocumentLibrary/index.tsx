import React from 'react';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AppWrapper from '../../../Components/AppWrapper';
import CustomText from '../../../Components/CustomText';
import DocumentCard from '../../../Components/DocumentCard';
import EmptyState from '../../../Components/EmptyState';
import FAB from '../../../Components/FAB';
import ModalComponent from '../../../Components/Modal';
import { selectDocuments } from '../../../Redux/Selectors';
import { removeDocument } from '../../../Redux/Slices/documentsSlice';
import { navigate } from '../../../Utils/navigation';
import colors from '../../../Utils/theme';
import { styles } from './styles';
import useDocumentLibraryController from './useDocumentLibraryController';

const ListSeparator = () => <View style={styles.separator} />;

const DocumentLibrary = () => {
  const documents = useSelector(selectDocuments);
  const dispatch = useDispatch();
  const { values, functions } = useDocumentLibraryController();

  return (
    <AppWrapper paddingHorizontal={0} disableScrollWrapper>
      <View style={styles.container}>
        <View style={styles.headerCopy}>
          <CustomText text="DocuAsk" size={22} weight="bold" />
          <CustomText
            text="Ask your documents anything"
            size={13}
            color={colors.lightText}
            style={styles.subtitle}
          />
        </View>

        {documents.length === 0 ? (
          <EmptyState
            title="No documents yet"
            subtitle="Paste text or pick a .txt file, then chat with an AI that answers from your content."
            ctaLabel="Add Document"
            onCtaPress={() => navigate('AddDocument')}
          />
        ) : (
          <FlatList
            data={documents}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={ListSeparator}
            renderItem={({ item }) => (
              <DocumentCard
                item={item}
                onPress={() => functions.openDocument(item.id)}
                onDelete={() => functions.confirmDelete(item.id)}
              />
            )}
          />
        )}

        <FAB onPress={() => navigate('AddDocument')} />

        <ModalComponent
          open={values.deleteModalOpen}
          close={functions.closeDeleteModal}
          header="Remove this document?"
          text="You can always add it again later. Chat history for this file will be cleared."
          buttons={[
            {
              text: 'Keep',
              type: 'secondary',
              onPress: functions.closeDeleteModal,
            },
            {
              text: 'Remove',
              type: 'primary',
              onPress: () => {
                if (values.pendingDeleteId) {
                  dispatch(removeDocument(values.pendingDeleteId));
                }
                functions.closeDeleteModal();
              },
            },
          ]}
        />
      </View>
    </AppWrapper>
  );
};

export default DocumentLibrary;
