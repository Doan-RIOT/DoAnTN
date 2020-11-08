/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState';
import { createReducer } from 'reduxsauce';
import { CartTypes } from './Actions';
import { saveCart } from '../../Utils/storage.helper';

export const addToCart = (state, { product, userId }) => {
  let { cart, total } = state;
  let { customerId } = cart;
  let orderForBranch = cart.orderForBranch ? cart.orderForBranch : [];
  const {
    orderNumber, productId, branchDefaultId, branchName, productCode
  } = product;
  if (customerId !== userId) {
    cart = {};
    customerId = userId;
    orderForBranch = [];
  }

  if (orderForBranch.length > 0) {
    const indexOrder = orderForBranch.findIndex(item => 
      item.branchId === branchDefaultId
    )
    if (indexOrder >= 0) {
      let order = orderForBranch[indexOrder];
      let { items } = order;
      const indexItem = items.findIndex(item => 
        item.productId === productId && item.productCode === productCode
      )
      if (indexItem >= 0) {
        items[indexItem].orderNumber += orderNumber;
      } else {
        items.push(product);
        total += 1;
      }
      order.items = items;
      orderForBranch[indexOrder] = order;
    } else {
      const order = {
        branchId: branchDefaultId,
        branchName: branchName,
        items: [product]
      };
      orderForBranch.push(order);
      total += 1;
    }
  } else {
    const order = {
      branchId: branchDefaultId,
      branchName: branchName,
      items: [product]
    };
    orderForBranch.push(order);
    total += 1;
  }

  cart.customerId = customerId;
  cart.orderForBranch = orderForBranch;
  saveCart(userId, JSON.stringify({
    cart,
    total,
  }));

  return {
    ...state,
    cart,
    total
  };
}

export const setDataToCart = (state, { cart, total, userId }) => {
  saveCart(userId, JSON.stringify({
    cart,
    total,
  }));
  return {
    ...state,
    cart,
    total,
  }
};

export const updateAddress = (state, { address, userId }) => {
  const { nameReceive, phoneNumber, city, districts, wards, addressReceive } = address;
  const receiveAddr = `${city ? `${city}, ` : ''}${districts ? `${districts}, ` : ''}${wards ? `${wards}, ` : ''}${addressReceive ? addressReceive : ''}`;
  let { cart, total } = state;
  cart.receiverName = nameReceive;
  cart.receiverPhone = phoneNumber;
  cart.receiveAddr = receiveAddr;
  saveCart(userId, JSON.stringify({
    cart,
    total,
  }));
  return {
    ...state,
    cart,
    total,
  }
};

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [CartTypes.ADD_TO_CART]: addToCart,
  [CartTypes.SET_DATA_TO_CART]: setDataToCart,
  [CartTypes.UPDATE_ADDRESS]: updateAddress,
})
