import axios from 'axios';
import { Config } from 'App/Config';
import { is, curryN, gte } from 'ramda';
import { getToken } from '../Utils/storage.helper';

const isWithin = curryN(3, (min, max, value) => {
  const isNumber = is(Number)
  return isNumber(min) && isNumber(max) && isNumber(value) && gte(value, min) && gte(max, value)
})
const in200s = isWithin(200, 299)

/**
 * This is an example of a service that connects to a 3rd party API.
 *
 * Feel free to remove this example from your application.
 */
const axiosDefault = axios.create({
  /**
   * Import the config from the App/Config/index.js file
   */
  baseURL: Config.API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 6000,
})

async function addToken() {
  const token = await getToken();
  const bearer = token ? `Bearer ${token}` : '';
  axiosDefault.defaults.headers.common['Authorization'] = bearer;
};

async function get(url, isNeedToken, params) {
  try {
    if (isNeedToken) {
      await addToken();
    }
    const response = await axiosDefault.get(url, {
      params: params,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      }
    });
    if (in200s(response.status)) {
      return response.data
    }
    return response;
  } catch (error) {
    return { status: 500, success: false, message:'Error' };
  }
}

async function post(url, data, isNeedToken, isPostForm) {
  try {
    if (isNeedToken) {
      await addToken();
    }
    if (isPostForm) {
      axiosDefault.defaults.headers.common['Content-Type'] = 'multipart/form-data';
    }
    const response = await axiosDefault.post(url, data);
    if (in200s(response.status)) {
      return response.data
    }
    return response;
  } catch (error) {
    return { status: 500, success: false, message:'Error' };
  }
}

export const Api = {
  get,
  post,
}
