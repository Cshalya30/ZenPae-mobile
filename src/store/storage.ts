import { Platform } from 'react-native';
import { appStorage as nativeStorage } from './storage.native';
import { appStorage as webStorage } from './storage.web';

export const appStorage = Platform.OS === 'web' ? webStorage : nativeStorage;
