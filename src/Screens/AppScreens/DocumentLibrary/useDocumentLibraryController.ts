import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveDocument } from '../../../Redux/Slices/documentsSlice';
import { navigate } from '../../../Utils/navigation';

const useDocumentLibraryController = () => {
  const dispatch = useDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const openDocument = (id: string) => {
    dispatch(setActiveDocument(id));
    navigate('DocumentChat', { documentId: id });
  };

  const confirmDelete = (id: string) => {
    setPendingDeleteId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPendingDeleteId(null);
  };

  return {
    values: {
      deleteModalOpen,
      pendingDeleteId,
    },
    functions: {
      openDocument,
      confirmDelete,
      closeDeleteModal,
    },
  };
};

export default useDocumentLibraryController;
