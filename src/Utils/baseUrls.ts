import { Platform } from 'react-native';

// iOS simulator: localhost
// Android emulator: 10.0.2.2 maps to host machine
// Physical device: set your machine LAN IP in .env or override here
const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const BASE_URL = `http://${DEV_HOST}:3001`;
