import AsyncStorage from '@react-native-community/async-storage';
import { Constants } from './constants';

export const saveLanguage = lang => {
  AsyncStorage.setItem(Constants.LANGUAGE, lang);
};

export const getLanguage = () => {
  return AsyncStorage.getItem(Constants.LANGUAGE);
};

export const saveToken = token => {
  AsyncStorage.setItem(Constants.TOKEN, token);
};

export const getToken = () => {
  return AsyncStorage.getItem(Constants.TOKEN);
};

export const saveUserId = id => {
  AsyncStorage.setItem(Constants.USER_ID, id);
};

export const getUserId = () => {
  return AsyncStorage.getItem(Constants.USER_ID);
};

export const saveCart = (userId, data) => {
  AsyncStorage.setItem(`${Constants.CART}_${userId}`, data);
};

export const getCart = userId => {
  return AsyncStorage.getItem(`${Constants.CART}_${userId}`);
};

export const removeStorageItem = (item) => {
  AsyncStorage.removeItem(item);
}

export const resetUser = () => {
  AsyncStorage.removeItem(Constants.TOKEN);
  AsyncStorage.removeItem(Constants.USER_ID);
  AsyncStorage.removeItem(Constants.LANGUAGE);
};