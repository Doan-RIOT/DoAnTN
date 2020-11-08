const chunk = (array, size) => {
  const chunkedArr = [];
  let index = 0;
  while (index < array.length) {
    chunkedArr.push(array.slice(index, size + index));
    index += size;
  }
  return chunkedArr;
}

const countProduct = (cart) => {
  const { orderForBranch } = cart;
  let count = 0;
  if (orderForBranch && orderForBranch.length > 0) {
    orderForBranch.forEach(orderBrach => {
      const { items } = orderBrach;
      if (items && items.length > 0) {
        count += items.length;
      }
    });
  }
  return count;
}

const mergeCart = (cart, cartMerge) => {
  let temp = {};
  if (cart && cartMerge) {
    const { totalProduct } = cart;
    temp = cart;
    temp.totalProduct = totalProduct ? totalProduct : 0;
    let { orderForBranch } = cart;
    if (cartMerge.orderForBranch && cartMerge.orderForBranch.length > 0) {
      const orderMerge = cartMerge.orderForBranch;
      if (orderForBranch && orderForBranch.length > 0 && orderMerge && orderMerge.length > 0) {
        orderMerge.forEach(orderBrachMerge => {
          const indexBranch = orderForBranch.findIndex(item => item.branchId === orderBrachMerge.branchId);
          const { items } = orderBrachMerge;
          if (indexBranch >= 0) {
            if (items && items.length > 0 && orderForBranch[indexBranch].items && orderForBranch[indexBranch].items.length > 0) {
              items.forEach(itemProductMerge => {
                const indexItemProduct = orderForBranch[indexBranch].items.findIndex(item => item.productId === itemProductMerge.productId && item.productCode === itemProductMerge.productCode);
                // if (indexItemProduct >= 0) {
                //   orderForBranch[indexBranch].items[indexItemProduct].orderNumber += itemProductMerge.orderNumber;
                //   temp.totalProduct += itemProductMerge.orderNumber;
                // } else {
                //   orderForBranch[indexBranch].items.push(itemProductMerge);
                //   orderForBranch[indexBranch].totalProduct += 1;
                //   temp.totalProduct += 1;
                // }
                if (indexItemProduct < 0) {
                  orderForBranch[indexBranch].items.push(itemProductMerge);
                  orderForBranch[indexBranch].totalProduct += 1;
                  // temp.totalProduct += 1;
                }
              });
            } else if (items && items.length > 0) {
              orderForBranch[indexBranch].items =items;
              orderForBranch[indexBranch].totalProduct = items.length;
              // temp.totalProduct += items.length;
            }
          } else {
            orderForBranch.push(orderBrachMerge);
          }
        });
        temp.orderForBranch = orderForBranch;
        temp.totalProduct =  countProduct(temp);
      } else if (cartMerge && cartMerge.orderForBranch && cartMerge.orderForBranch.length > 0) {
        temp.orderForBranch = cartMerge.orderForBranch;
        temp.totalProduct =  countProduct(temp);
      }
    }
  } else if (cartMerge) {
    temp = cartMerge;
    temp.totalProduct =  countProduct(temp);
  }
  
  return temp;
};

const textTruncate = (str, num) =>{
  if (str.length < num) return str;
    var truncStr = str.slice(0, num);
    var truncStrArr = truncStr.split(' ');
    var truncStrArrLen=truncStrArr.length;
    
    if(truncStrArrLen > 1 &&
      truncStrArr[truncStrArrLen - 1] !== str.split(' ')[truncStrArrLen - 1]) {
      truncStrArr.pop();
      truncStr = truncStrArr.join(' ');
    }
    return str.length > num ? truncStr + '...' : truncStr;
};

export {
  chunk,
  mergeCart,
  textTruncate
}