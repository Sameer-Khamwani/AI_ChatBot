import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';
import AppWrapper from '../../../Components/AppWrapper';
import Button from '../../../Components/Button';
import CustomText from '../../../Components/CustomText';
import CustomTextInput from '../../../Components/CustomTextInput';
import {
  addDocumentInitialValues,
  addDocumentSchema,
} from '../../../Utils/validation';
import colors from '../../../Utils/theme';
import useAddDocumentController from './useAddDocumentController';
import { styles } from './styles';

const AddDocument = () => {
  const { values, functions } = useAddDocumentController();

  return (
    <AppWrapper>
      <CustomText
        text="Paste text, pick a .txt file, or upload a PDF. PDF extraction requires Real API mode and a running backend."
        size={13}
        color={colors.lightText}
        style={styles.hint}
      />

      <Formik
        initialValues={addDocumentInitialValues}
        validationSchema={addDocumentSchema}
        onSubmit={functions.handleSubmit}>
        {({
          handleChange,
          handleSubmit,
          values: formValues,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View>
            <CustomTextInput
              label="Title"
              required
              placeholder="e.g. Product Handbook"
              value={formValues.title}
              onChangeText={handleChange('title')}
              error={touched.title ? errors.title : undefined}
              containerStyle={styles.field}
            />

            <CustomTextInput
              label="Content"
              required
              placeholder="Paste your document text here..."
              value={formValues.content}
              onChangeText={handleChange('content')}
              multiline
              error={touched.content ? errors.content : undefined}
              containerStyle={styles.field}
            />

            <Button
              text="Pick .txt or PDF"
              buttonType="secondary"
              onPress={() => functions.pickDocument(setFieldValue)}
              style={styles.pickButton}
              loading={values.picking}
            />

            <Button
              text="Save Document"
              onPress={() => handleSubmit()}
              loading={values.saving}
              style={styles.saveButton}
            />
          </View>
        )}
      </Formik>
    </AppWrapper>
  );
};

export default AddDocument;
