import React from 'react';
import { Switch, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AppWrapper from '../../../Components/AppWrapper';
import CustomText from '../../../Components/CustomText';
import CustomTextInput from '../../../Components/CustomTextInput';
import Row from '../../../Components/Row';
import {
  selectApiKeyHint,
  selectUseRealApi,
} from '../../../Redux/Selectors';
import {
  setApiKeyHint,
  setUseRealApi,
} from '../../../Redux/Slices/settingsSlice';
import {
  APP_NAME,
  APP_TAGLINE,
  APP_TECH_STACK,
  APP_VERSION,
} from '../../../Utils/constants';
import colors from '../../../Utils/theme';
import { styles } from './styles';

const Settings = () => {
  const dispatch = useDispatch();
  const useRealApi = useSelector(selectUseRealApi);
  const apiKeyHint = useSelector(selectApiKeyHint);

  return (
    <AppWrapper>
      <CustomText
        text="Choose how DocuAsk answers. Keep Real API off for fast local demo replies."
        size={13}
        color={colors.lightText}
        style={styles.hint}
      />

      <View style={styles.card}>
        <Row justifyContent="space-between" alignItems="center">
          <View style={styles.switchCopy}>
            <CustomText text="Use Real API (RAG)" size={15} weight="semibold" />
            <CustomText
              text="Requires backend on port 3001"
              size={12}
              color={colors.lightText}
            />
          </View>
          <Switch
            value={useRealApi}
            onValueChange={v => {
              dispatch(setUseRealApi(v));
            }}
            trackColor={{ false: colors.darkButton, true: colors.primary }}
            thumbColor={colors.white}
          />
        </Row>
      </View>

      <View style={styles.card}>
        <CustomText
          text="API key note"
          size={15}
          weight="semibold"
          style={styles.fieldLabel}
        />
        <CustomText
          text="OpenAI keys stay on the backend (.env). This field is a local reminder only — never sent from the app."
          size={12}
          color={colors.lightText}
          style={styles.fieldHint}
        />
        <CustomTextInput
          placeholder="e.g. key configured on server"
          value={apiKeyHint}
          onChangeText={v => {
            dispatch(setApiKeyHint(v || ''));
          }}
          editable={false}
          disabled
        />
      </View>

      <View style={styles.card}>
        <CustomText text="About" size={15} weight="semibold" />
        <CustomText
          text={`${APP_NAME} v${APP_VERSION}`}
          size={13}
          weight="semibold"
          style={styles.aboutTitle}
        />
        <CustomText
          text={APP_TAGLINE}
          size={12}
          color={colors.lightText}
          style={styles.about}
        />
        <CustomText
          text={APP_TECH_STACK}
          size={12}
          color={colors.optionsColor}
          style={styles.about}
        />
        <CustomText
          text="Mock mode answers from document text on-device. RAG mode chunks, retrieves, and generates via the Node backend."
          size={12}
          color={colors.lightText}
          style={styles.about}
        />
      </View>
    </AppWrapper>
  );
};

export default Settings;
