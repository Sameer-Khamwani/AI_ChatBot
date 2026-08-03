import { ReactNode } from 'react';
import {
  ColorValue,
  ImageSourcePropType,
  ImageStyle,
  KeyboardTypeOptions,
  ReturnKeyType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface ICustomText {
  style?: StyleProp<TextStyle>;
  lines?: number;
  weight?: 'bold' | 'semibold' | 'regular' | 'light';
  color?: ColorValue;
  size?: number;
  text?: string | number;
  onPress?: () => void;
  required?: boolean;
  requiredStyle?: TextStyle;
  textContainer?: StyleProp<TextStyle>;
  children?: ReactNode;
  disabled?: boolean;
}

export interface ICustomTextInput {
  name?: string;
  size?: number;
  label?: string;
  required?: boolean;
  leftIcon?: ImageSourcePropType;
  leftIconColor?: string;
  children?: ReactNode;
  rightIcon?: ImageSourcePropType;
  leftIconStyle?: StyleProp<ImageStyle>;
  rightIconStyle?: StyleProp<ImageStyle>;
  onPressRightIcon?: () => void;
  secureTextEntry?: boolean;
  eyeIconStyle?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  textInputContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: TextStyle;
  requiredStyle?: TextStyle;
  placeholderTextColor?: string;
  onChangeText?: (value?: any) => void;
  value?: string;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  returnKeyType?: ReturnKeyType | 'default';
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  lines?: number;
  error?: string;
  editable?: boolean;
  onPress?: () => void;
}

export interface IButton {
  onPress?: () => void;
  text?: string;
  children?: string | ReactNode;
  buttontextcolor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  weight?: 'bold' | 'semibold' | 'regular' | 'light';
  size?: number;
  buttonLoader?: boolean;
  buttonType?: 'primary' | 'secondary' | string;
  loading?: boolean;
  disabled?: boolean;
  primaryStyle?: ViewStyle;
  loader?: boolean;
  loaderColor?: string;
}

export interface IRow {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  gap?: number;
  onPress?: () => void;
}

export interface IAppWrapper {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disableBottomPadding?: boolean;
  bottomPadding?: number;
  paddingHorizontal?: number;
  disableScrollWrapper?: boolean;
}

export interface LoaderProps {
  color?: string;
  size?: 'small' | 'large';
  text?: string;
  visible?: boolean;
}

export interface IModalComponent {
  open: boolean;
  close?: () => void;
  text?: string;
  header?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  buttons?: Array<{
    text: string;
    onPress: () => void;
    type?: 'primary' | 'secondary';
    style?: StyleProp<ViewStyle>;
  }>;
}

export type DocumentFileType = 'text' | 'pdf' | 'doc';

export interface IDocument {
  id: string;
  title: string;
  content: string;
  fileType: DocumentFileType;
  createdAt: string;
  summary?: string;
}

export type MessageRole = 'user' | 'assistant';

export interface ISourceChip {
  id: string;
  label: string;
  snippet: string;
  score?: number;
}

export type SourceInput = string | ISourceChip;

export interface IMessage {
  _id: string;
  text: string;
  createdAt: string;
  role: MessageRole;
  sources?: SourceInput[];
}

export interface IDocumentChat {
  documentId: string;
  messages: IMessage[];
}

export interface IDocumentCard {
  item: IDocument;
  onPress: () => void;
  onDelete?: () => void;
}

export interface IMessageBubble {
  message: IMessage;
}

export interface IFAB {
  onPress: () => void;
}

export interface IEmptyState {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
}
