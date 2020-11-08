
import ReactNative from 'react-native';
import I18n from 'react-native-i18n';
// import moment from 'moment';
import {
  getLanguage,
  saveLanguage,
} from 'App/Utils/storage.helper';
// Import all locales
import en from './en.json';
import vi from './vi.json';
import { Constants } from 'App/Utils/constants';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  vi,
  en
};

getLanguage().then(lang => {
  I18n.locale = lang!== null ? lang: Constants.VI;
});
const currentLocale = I18n.currentLocale();
// Is it a RTL language?
export const isRTL = currentLocale.indexOf('vi') === 0 || currentLocale.indexOf('en') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// Localizing momentjs to Hebrew or English
// if (currentLocale.indexOf('vi') === 0) {
//   require('moment/locale/nl.js');
//   moment.locale('vi');
// } else {
//   moment.locale('en');
// }
export function strings(name, params = {}) {
  return I18n.t(name, params);
};
export const switchLanguage = (lang, component) => {
   saveLanguage(lang);
   I18n.locale = lang;
   component.forceUpdate();
};
export default I18n;
