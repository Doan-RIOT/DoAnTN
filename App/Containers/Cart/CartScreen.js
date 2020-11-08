import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import {
  Image, TouchableOpacity,
  Dimensions, ScrollView,
} from 'react-native';
import UserActions from '../../Stores/User/Actions';
import {
  Button, Block,Text, Header, Input, TextCurrency, BaseModal,
} from "../../Components";
import CartActions from '../../Stores/Cart/Actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { sortBy } from 'lodash';
import { strings } from '../../Locate/I18n';
import Style from './CartScreenStyle';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { resetUser } from '../../Utils/storage.helper';
import { Screens } from '../../Utils/screens';
import { Config } from '../../Config/index'
import { Constants } from '../../Utils/constants';
import { cartService } from '../../Services/CartService';
const { height, width } = Dimensions.get('window');

class CartScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errorCode: '',
      isEditing: false,
      cart: {},
      total: 0,
      isOpen: false,
      infoPromotion: {},
      isOpenPromotion: false
      // indexBranch: null,
      // indexProduct: null,
      // indexPromotion: null,
      // indexPromotionReplace: null,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, cart, total } = nextProps;
    const { isEditing } = prevState;
    let data = { errorCode };
    if (!isEditing) {
      data.cart = JSON.parse(JSON.stringify(cart));
      data.total = total;
    }
    return data;
  }

  componentDidMount = () => {};

  updateAddress = addressDefault => {
    this.handleProcessEdit(true);
    if (Object.entries(addressDefault).length > 0) {
      let { cart } = this.state;
      const { userId } = this.props;
      const { nameReceive, phoneNumber, city, districts, wards, addressReceive } = addressDefault;
      const receiveAddr = `${city ? `${city}, ` : ''}${districts ? `${districts}, ` : ''}${wards ? `${wards}, ` : ''}${addressReceive ? addressReceive : ''}`;
      cart.receiverName = nameReceive;
      cart.receiverPhone = phoneNumber;
      cart.receiveAddr = receiveAddr;
      this.updateCart(cart, userId);
    }
  };

  renderAddress = () => {
    const { cart } = this.state;
    const { navigation } = this.props;
    const { receiverName, receiverPhone, receiveAddr } = cart;
    
    return (
      <Block flex={false} style={Style.container}>
        <Block flex={false} row>
          <Text>
            <Icon name="map-marker" size={20} />
          </Text>
          <Block style={{ marginLeft: 10 }}>
            <Block flex={false} row space="between">
              <Text h3>
               {strings('Cart.addressReceiver')}
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate(Screens.CHANGE_ADDRESS, {goBackAction: 'updateAddress', 'updateAddress': this.updateAddress})}
              >
                <Text green h3>{strings('Cart.changeAddress')}</Text>
              </TouchableOpacity>
            </Block>
            <Text h3>
              {`${receiverName ? receiverName : ''}${receiverPhone ? ` - ${receiverPhone}`: ''}`}
            </Text>
            <Text h3>
              {receiveAddr ? receiveAddr : ''}
            </Text>
          </Block>
        </Block>
      </Block>
    )
  };

  // renderBodyModal = () => {
  //   return (
  //     <Block>
  //       <Text h2 error>{strings('Cart.msgConfirmReplacePromotion')}</Text>
  //     </Block>
  //   );
  // };

  // renderFooterModal = () => {
  //   return (
  //     <Block flex={false} bottom>
  //       <Button
  //         green
  //         onPress={() => this.handleSaveModal()}
  //       >
  //         <Text bold white center>
  //           {strings('Modal.ok')}
  //         </Text>
  //       </Button>
  //       <Button
  //         pink2
  //         onPress={() => this.handleCloseModal()}
  //       >
  //         <Text bold white center>
  //           {strings('Modal.cancel')}
  //         </Text>
  //       </Button>
  //     </Block>
  //   )
  // };

  // handleSaveModal = () => {
  //   let { cart, indexBranch, indexProduct, indexPromotion, indexPromotionReplace } = this.state;
  //   this.resetPromotion(cart, indexBranch);
  //   if (indexProduct !== null) {
  //     cart.orderForBranch[indexBranch].items[indexProduct].promotion[indexPromotionReplace].isSelected = 0;
  //     cart.orderForBranch[indexBranch].items[indexProduct].promotion[indexPromotion].isSelected = 1;
  //   } else {
  //     cart.orderForBranch[indexBranch].promotion[indexPromotionReplace].isSelected = 0;
  //     cart.orderForBranch[indexBranch].promotion[indexPromotion].isSelected = 1;
  //   }
  //   this.setState({
  //     cart,
  //   })
  //   this.handleCloseModal();
  // }

  // handleCloseModal = () => {
  //   this.setState({
  //     isOpen: false,
  //     indexBranch: null,
  //     indexProduct: null,
  //     indexPromotion: null,
  //     indexPromotionReplace: null,
  //   })
  // };

  renderBodyModalPromotion = () => {
    const {infoPromotion} = this.state;
    return (
      <Block column >
        <Block row >
            <Text body gray style={Style.titlePromotion}>{strings('Cart.promotionName')}</Text>
            <Text body style={Style.contentPromotion}>{infoPromotion.promotionName ? infoPromotion.promotionName : ''}</Text>
        </Block>
        <Block row >
            <Text body gray style={Style.titlePromotion}>{strings('Cart.promotionDateStart')}</Text>
            <Text body style={Style.contentPromotion}>{infoPromotion.dateStart ? infoPromotion.dateEnd : ""}</Text>
        </Block>
        <Block row >
            <Text body gray style={Style.titlePromotion}>{strings('Cart.promotionDateEnd')}</Text>
            <Text body style={Style.contentPromotion}>{infoPromotion.dateEnd ? infoPromotion.dateEnd : ""}</Text>
        </Block>
        <Block row >
            <Text body gray style={Style.titlePromotion}>{strings('Cart.promotionDes')}</Text>
            <Text body style={Style.contentPromotion}>{infoPromotion.promotionDes ? infoPromotion.promotionDes : ""}</Text>
        </Block>
      </Block>
    );
  }

  renderBodyModal = () => {
    const { navigation } = this.props;
    return (
      <Block>
        <Button
          green
          onPress={() => {
            this.handleCloseModal();
            navigation.navigate(Screens.LOGIN)
          }}
        >
          <Text bold white center>
            {strings('Login.login')}
          </Text>
        </Button>
        <Button
          green
          onPress={() => {
            this.handleCloseModal();
            navigation.navigate(Screens.SIGNUP)
          }}
        >
          <Text bold white center>
            {strings('Login.signUp')}
          </Text>
        </Button>
      </Block>
    );
  };

  renderFooterModal = () => {
    return (
      <></>
    )
  };

  handleCloseModal = () => {
    this.setState({
      isOpen: false,
      isOpenPromotion: false
    })
  };

  handleOrderNumber = (branchId, index, isAdd) => {
    this.handleProcessEdit(true);
    let { cart } = this.state;
    let { userId } = this.props;
    const { orderForBranch } = cart;
    const indexBranch = orderForBranch.findIndex(item => item.branchId === branchId);
    let item = cart.orderForBranch[indexBranch].items[index];
    if (isAdd) {
      item.orderNumber += 1;
    } else {
      item.orderNumber = item.orderNumber > 0 ? item.orderNumber - 1 : 0;
    }
    cart.orderForBranch[indexBranch].items[index] = item;
    this.updateCart(cart, userId);
  };

  handleInputOrderNumber = (branchId, index, orderNumber) => {
    this.handleProcessEdit(true);
    const tmp = orderNumber ? orderNumber : 0;
    let { cart } = this.state;
    const { orderForBranch } = cart;
    const indexBranch = orderForBranch.findIndex(item => item.branchId === branchId);
    let item = cart.orderForBranch[indexBranch].items[index];
    item.orderNumber = parseInt(tmp);
    cart.orderForBranch[indexBranch].items[index] = item;
  };

  deleteProduct = (branchId, item) => {
    this.handleProcessEdit(true);
    let { cart } = this.state;
    let { userId } = this.props;
    const { productId, productCode } = item;
    const { orderForBranch } = cart;
    const indexBranch = orderForBranch.findIndex(item => item.branchId === branchId);
    let { items } = cart.orderForBranch[indexBranch];
    const indexProduct = items.findIndex(item => item.productId === productId && item.productCode === productCode);
    items.splice(indexProduct, 1);
    if (items.length > 0) {
      cart.orderForBranch[indexBranch].items = items;
    } else {
      cart.orderForBranch.splice(indexBranch, 1);
    }
    this.updateCart(cart, userId);
  };

  updateCart = (cart, userId) => {
    const { language, cartActions } = this.props;
    this.handleProcessEdit(true);
    if (userId && userId !== '') {
      cartService.createOrders(cart, language).then(response => {
        if (response.success) {
          const data = response.data && response.data !== null ? response.data : {};
          const total = data.totalProduct ? data.totalProduct : 0;
          this.setState({
            cart: data,
            total,
          })
          cartActions.setDataToCart(data, total, userId);
        }
      }).catch(error =>{});
    } else {
      cartService.createOrdersAnonymous(cart, language).then(response => {
        const data = response.data && response.data !== null ? response.data : {};
          const total = data.totalProduct ? data.totalProduct : 0;
          this.setState({
            cart: data,
            total,
          })
          cartActions.setDataToCart(data, total, userId);
      }).catch(error =>{});
    }
  };

  handlePromotionsProduct = (indexBranch, indexPromotion, indexProduct) => {
    this.handleProcessEdit(true);
    let { cart } = this.state;
    const { promotion } = cart.orderForBranch[indexBranch].items[indexProduct];
    const { userId } = this.props;
    const promotionSelected = promotion[indexPromotion];
    const { isSelected } = promotionSelected;
    this.resetPromotion(cart, indexBranch);
    cart.orderForBranch[indexBranch].items[indexProduct].promotion[indexPromotion].isSelected = isSelected === 0 ? 1 : 0;
    this.updateCart(cart, userId);
    this.setState({isOpenPromotion: true, infoPromotion: promotion[indexPromotion]})
    // const isDuplicate = this.checkDuplicateTypePromotion(promotionSelected, promotion);
    // if (isDuplicate) {
    //   this.setState({
    //     isOpen: true,
    //     indexBranch,
    //     indexPromotion,
    //     indexProduct,
    //   });
    // } else {
    //   const { isSelected } = promotionSelected;
    //   this.resetPromotion(cart, indexBranch);
    //   cart.orderForBranch[indexBranch].items[indexProduct].promotion[indexPromotion].isSelected = isSelected === 0 ? 1 : 0;
    //   this.updateCart(cart, userId);
    // }
  };

  resetPromotion = (cart, indexBranch) => {
    let { promotion, items } = cart.orderForBranch[indexBranch];
    promotion = promotion.map(item => {
      return {...item, isSelected: 0}
    });

    items = items.map(item => {
      let { promotion } = item;
      promotion = promotion.map(pr => {
        return {...pr, isSelected: 0}
      });
      return {...item, promotion}
    });
    cart.orderForBranch[indexBranch].promotion = promotion;
    cart.orderForBranch[indexBranch].items = items;
  } 

  handleShowPromotion = (indexBranch, indexProduct, lengthPromotion) => {
    this.handleProcessEdit(true)
    let { cart } = this.state;
    let { orderForBranch } = cart;
    if (indexProduct !== null) {
      orderForBranch[indexBranch].items[indexProduct].optionLimitPromo = lengthPromotion;
    } else {
      orderForBranch[indexBranch].optionLimitPromo = lengthPromotion;
    }
    cart.orderForBranch = orderForBranch;
    this.setState({
      cart,
    })
  };

  renderItemOrderBranch = (items, branchId, indexBranch) => {
    let htmlItems = [];
    const { cart } = this.state;
    const { userId, navigation } = this.props;
    if (items && items.length > 0) {
      items.forEach((item, index) => {
        const { imageUrl, productName, salePrice, orderNumber, productId, promotion, productCode } = item;
        let htmlPromotion = [];
        if (promotion && promotion.length > 0) {
          promotion.forEach((pr, indexPromotion) => {
            const selected = pr.isSelected === 1 ? true : false;
            const disabled = pr.isValid === 0 ? true : false;
            if (indexPromotion < item.optionLimitPromo) {
              htmlPromotion.push(
                <TouchableOpacity
                  style={[Style.promotion, selected ? Style.promotionSelect : null, disabled ? { backgroundColor: Colors.gray3 } : { backgroundColor: Colors.green2 }]}
                  disabled={disabled}
                  key={pr.promotionId}
                  onPress={() => this.handlePromotionsProduct(indexBranch, indexPromotion, index)}
                >
                  <Text>{pr.promotionName ? pr.promotionName : ''}</Text>
                </TouchableOpacity>
              )
            }
          });
        }
        const disabledMinus = orderNumber && orderNumber === 0 || !orderNumber ? true : false;
        const disabledAdd = orderNumber && orderNumber >= 100 ? true : false;
        const htmlItem = (
          <Block center row >
            <Block flex={false} style={{ width: '30%' }}>
              <Image 
                source={{uri: `${Config.IMAGE_URL}${imageUrl}`}}
                style={Style.productImage}
              />
            </Block>
            <Block flex={false} style={{ width: '70%', paddingHorizontal: 10 }}>
              <TouchableOpacity
                key={productId}
                onPress={() => 
                  navigation.navigate(Screens.PRODUCT_DETAIL, { productId, productCode, branchId })}
              >
                <Text bold h3 style={{ textDecorationLine: 'underline' }}>{productName}</Text>
              </TouchableOpacity>
              <Text bold h3 pink2 style={{ marginTop: 10 }}><TextCurrency pink2 h3 bold value={salePrice} /> đ</Text>
              {promotion && promotion.length > 0 ? (
                <Block center row style={{marginTop: 5}}>
                  <Icon name="gift" size={30} color={Colors.green} />
                  <Block style={{marginLeft: 10}}>
                    {htmlPromotion}
                    {promotion && promotion.length > item.optionLimitPromo ? (
                      <TouchableOpacity 
                        onPress={() => this.handleShowPromotion(indexBranch, index, promotion.length)}
                      >
                        <Text green>{strings('Cart.expand')}</Text>
                      </TouchableOpacity>
                    ) : null}
                    {promotion && promotion.length > item.defaultLimitPromo && promotion.length == item.optionLimitPromo ? (
                      <TouchableOpacity 
                        onPress={() => this.handleShowPromotion(indexBranch, index, Constants.MAX_PROMOTION_SHOW)}
                      >
                        <Text green>{strings('Cart.collapse')}</Text>
                      </TouchableOpacity>
                    ) : null}
                  </Block>
                </Block>
              ) : null}
              <Block center row>
                <Button
                  style={Style.button}
                  onPress={() => this.handleOrderNumber(branchId, index, false)}
                  disabled={disabledMinus}
                >
                  <Text center><Icon name="minus" size={10} color={disabledMinus ? Colors.gray : Colors.black} /></Text>
                </Button>
                <Input
                  value={orderNumber ? (orderNumber).toString() : '0'}
                  style={[Style.button, { width: 52, marginTop: 5 }]}
                  onChangeText={orderNumber => this.handleInputOrderNumber(branchId, index, orderNumber)}
                  number
                  textAlign={'center'}
                  onBlur={() => this.updateCart(cart, userId)}
                />
                <Button
                  style={Style.button}
                  onPress={() => this.handleOrderNumber(branchId, index, true)}
                  disabled={orderNumber && orderNumber >= 100}
                >
                  <Text center><Icon name="plus" size={10} color={disabledAdd ? Colors.gray : Colors.black} /></Text>
                </Button>
                <Button
                  style={[Style.button, {marginLeft: 15, borderWidth: 0}]}
                  onPress={() => this.deleteProduct(branchId, item)}
                >
                  <Text center><Icon name="trash" size={30} color={Colors.green} /></Text>
                </Button>
              </Block>
            </Block>
          </Block>
        )
        htmlItems.push(htmlItem);
      });
    }

    return (
      <Block style={{ marginTop: 10 }}>
        {htmlItems}
      </Block>
    );
  };

  handlePromotionsBranch = (indexBranch, indexPromotion) => {
    this.handleProcessEdit(true);
    let { cart } = this.state;
    const { promotion } = cart.orderForBranch[indexBranch];
    const { userId } = this.props;
    const promotionSelected = promotion[indexPromotion];
    const { isSelected } = promotionSelected;
    this.resetPromotion(cart, indexBranch);
    cart.orderForBranch[indexBranch].promotion[indexPromotion].isSelected = isSelected === 0 ? 1 : 0;
    this.updateCart(cart, userId);
    this.setState({
      isOpenPromotion: true,
      infoPromotion : promotion[indexPromotion]});
    // const isDuplicate = this.checkDuplicateTypePromotion(promotionSelected, promotion)
    // if (isDuplicate) {
    //   this.setState({
    //     isOpen: true,
    //     indexBranch,
    //     indexPromotion,
    //   });
    // } else {
    //   const { isSelected } = promotionSelected;
    //   this.resetPromotion(cart, indexBranch);
    //   cart.orderForBranch[indexBranch].promotion[indexPromotion].isSelected = isSelected === 0 ? 1 : 0;
    //   this.updateCart(cart, userId);
    // }
  };

  checkDuplicateTypePromotion = (promotionSelected, promotion) => {
    const indexPromotionReplace = promotion.findIndex(item => item.promotionTypeId === promotionSelected.promotionTypeId && item.promotionId !== promotionSelected.promotionId && item.isSelected === 1);
    if (indexPromotionReplace >= 0) {
      this.setState({
        indexPromotionReplace,
      })
    }

    return indexPromotionReplace >= 0 ? true : false;
  };

  handleSelectShipment = (indexBranch, shipment) => {
    this.handleProcessEdit(true);
    let { cart } = this.state;
    const { userId } = this.props;
    const { unitId, price, estimationDate } = shipment;
    cart.orderForBranch[indexBranch].shipmentUnitId = unitId;
    cart.orderForBranch[indexBranch].shipmentPrice = price;
    cart.orderForBranch[indexBranch].estimatedShipDate = estimationDate;
    this.updateCart(cart, userId);
  };

  renderOrderBranch = (orderBranch, indexBranch) => {
    const { isEditing } = this.state;
    let { branchName, items, branchId, promotion, optionShipment, shipmentUnitId } = orderBranch;
    if (items && items.length > 0) {
      items = items.map(item => {
        return {...item, optionLimitPromo: !isEditing ? item.defaultLimitPromo : item.optionLimitPromo}
      })
    }
    let htmlPromotion = [];
    if (promotion && promotion.length > 0) {
      promotion.forEach((item, index) => {
        const selected = item.isSelected === 1 ? true : false;
        const disabled = item.isValid === 0 ? true : false;
        if (index < orderBranch.optionLimitPromo) {
          htmlPromotion.push(
            <TouchableOpacity
              style={[Style.promotion, selected ? Style.promotionSelect : null, disabled ? { backgroundColor: Colors.gray3 } : { backgroundColor: Colors.green2 }]}
              disabled={disabled}
              key={item.promotionId}
              onPress={() => this.handlePromotionsBranch(indexBranch, index)}
            >
              <Text>{item.promotionName ? item.promotionName : ''}</Text>
            </TouchableOpacity>
          )
        }
      });
    }

    let htmlShipment = [];
    if (optionShipment && optionShipment.length > 0) {
      optionShipment.forEach(item => {
        const selected = item.unitId === shipmentUnitId ? true : false;
        htmlShipment.push(
          <TouchableOpacity
            style={[Style.promotion, selected ? Style.promotionSelect : null, { backgroundColor: Colors.green2 }]}
            key={item.unitId}
            onPress={() => this.handleSelectShipment(indexBranch, item)}
          >
            <Text h3>{item.unitName ? item.unitName : ''}</Text>
            <Text h3 pink2 bold>
              <TextCurrency
                h3 pink2 bold value={item.price ? item.price : 0} /> đ</Text>
            <Text h3>{item.estimationDate ? `${strings('Cart.estimationDate')} ${item.estimationDate}` : ''}</Text>
          </TouchableOpacity>
        )
      });
    }

    return (
      <Block key={branchId}>
        {items.length > 0 ? (
          <Block style={Style.container}>
            <Text h3 green bold>{branchName}</Text>
            {this.renderItemOrderBranch(items, branchId, indexBranch)}
            {promotion && promotion.length > 0 ? (
              <Block center row style={{marginTop: 5}}>
                <Icon name="gift" size={30} color={Colors.green} />
                <Block style={{marginLeft: 10}}>
                  {htmlPromotion}
                  {promotion && promotion.length > orderBranch.optionLimitPromo ? (
                    <TouchableOpacity
                      onPress={() => this.handleShowPromotion(indexBranch, null, promotion.length)}
                    >
                      <Text green>{strings('Cart.expand')}</Text>
                    </TouchableOpacity>
                  ) : null}
                  {promotion && promotion.length > orderBranch.defaultLimitPromo && promotion.length == orderBranch.optionLimitPromo ? (
                    <TouchableOpacity
                      onPress={() => this.handleShowPromotion(indexBranch, null, Constants.MAX_PROMOTION_SHOW)}
                    >
                      <Text green>{strings('Cart.collapse')}</Text>
                    </TouchableOpacity>
                  ) : null}
                </Block>
              </Block>
            ) : null}
            {optionShipment && optionShipment.length > 0 ? (
              <Block style={{marginTop: 5}}>
                <Text h3 green>{`${strings('Cart.chooseShipment')}:`}</Text>
                <Block style={{marginTop: 5}}>{htmlShipment}</Block>
              </Block>
            ) : null}
          </Block>
        ) : null}
      </Block>
    )
  };

  renderProductsOrder = () => {
    const { cart, isEditing } = this.state;
    let { orderForBranch } = cart;
    let htmlProductsOrder = [];
    if (orderForBranch && orderForBranch.length > 0) {
      for (let index = 0; index < orderForBranch.length; index +=1) {
        let orderBranch = orderForBranch[index];
        orderBranch.optionLimitPromo = !isEditing ? orderBranch.defaultLimitPromo : orderBranch.optionLimitPromo;
        const htmlOderBranch = this.renderOrderBranch(orderBranch, index);
        htmlProductsOrder.push(htmlOderBranch);
      }
    }
    
    return htmlProductsOrder;
  };

  handleProcessEdit = isEditing => {
    this.setState({
      isEditing,
    });
  };

  handleChangePoint = value => {
    this.handleProcessEdit(true);
    const point = value && value !== '' ? value : 0;
    let { cart } = this.state;
    cart.pointToPay = parseFloat(point);
    this.setState({
      cart,
    })
  };

  handleUpdateChangePoint = () => {
    let { cart } = this.state;
    const { userId } = this.props;
    const { pointToPay, partyPoint } = cart;
    if (partyPoint && partyPoint.nowPoints && partyPoint.nowPoints < pointToPay) {
      this.refs.toastFailed.show(strings('Cart.msgErrorPointToPay'), DURATION.LENGTH_LONG);
    } else {
      this.updateCart(cart, userId);
    }
  };

  checkAddress = str => {
    return (!str || 0 === str.length || /^\s*$/.test(str));
  };

  checkOrders = cart => {
    const { orderForBranch } = cart;
    let count = 0;
    let isErrorAddress = false;
    let isErrorShipment = false;
    const { receiverName, receiverPhone, receiveAddr } = cart;
    if (this.checkAddress(receiverName) || this.checkAddress(receiverPhone) || this.checkAddress(receiveAddr)) isErrorAddress = true;
    if (orderForBranch.length > 0) {
      orderForBranch.forEach(itemBrach => {
        let { items } = itemBrach;
        if (itemBrach.shipmentUnitId === null) isErrorShipment = true;
        if (items && items.length > 0) {
          items.forEach(item => {
            count += item.orderNumber;
          });
        }
      });
    }
    const isErrorOrderNumber = count === 0 ? true : false;

    return {
      isErrorAddress,
      isErrorShipment,
      isErrorOrderNumber,
    }
  };

  handleToPayment = () => {
    const { navigation, userId } = this.props;
    if (userId && userId !== '') {
      const { cart } = this.state;
      let isError = false;
      const {
        isErrorAddress,
        isErrorShipment,
        isErrorOrderNumber,
      } = this.checkOrders(cart);
      if (isErrorAddress) {
        isError = true;
        this.refs.toastFailed.show(strings('Cart.msgErrorAddress'), DURATION.LENGTH_LONG);
      } else if (isErrorShipment) {
        isError = true;
        this.refs.toastFailed.show(strings('Cart.msgErrorShipment'), DURATION.LENGTH_LONG);
      } else if (isErrorOrderNumber) {
        isError = true;
      }

      if (!isError) {
        navigation.navigate(Screens.PAYMENT_METHOD, { cart });
      }
    } else {
      this.setState({
        isOpen: true,
      })
    }
  };

  renderContent = () => {
    const { cart } = this.state;
    const { userId } = this.props;
    const { finishPrice, pointToPay, subTract, tempPrice, shipmentPrice, pointPlus, partyPoint } = cart;

    return (
      <Block>
        <Block flex={false} style={{ height: height >= 720 ? height * 0.75: height * 0.70, paddingBottom: 5 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {userId && userId !== '' ? this.renderAddress() : null}
            {this.renderProductsOrder()}
            <Block style={Style.container}>
              {userId && userId !== '' ? (
                <>
                  <Block center row space="between">
                    <Block flex={false} style={{ width: '60%'}}>
                      <Text green>
                        {`${strings('Cart.payByPoint')}:`}
                      </Text>
                    </Block>
                    <Block flex={false} style={{ width: '38%'}}>
                      <Input
                        value={pointToPay ? pointToPay : 0}
                        style={Style.input}
                        number
                        onChangeText={value => this.handleChangePoint(value)}
                        onBlur={() => this.handleUpdateChangePoint()}
                      />
                    </Block>
                  </Block>
                  <Text gray style={{ marginVertical: 2 }}>{`${strings('Cart.msgNowPointsLeft')} ${partyPoint && partyPoint.nowPoints ? partyPoint.nowPoints : 0} ${strings('Cart.msgNowPointsRight')}.`}</Text>
                  </>
              ) : null}
              
              <Block center row space="between">
                <Block flex={false} style={{ width: '60%'}}>
                  <Text green>
                    {`${strings('Cart.tempPrice')}:`}
                  </Text>
                </Block>
                <Block flex={false} style={{ width: '38%'}}>
                  <Text>
                  <TextCurrency 
                    value={tempPrice ? tempPrice : 0} /> đ</Text>
                </Block>
              </Block>
              <Block center row space="between">
                <Block flex={false} style={{ width: '60%'}}>
                  <Text green>
                    {`${strings('Cart.shipPrice')}:`}
                  </Text>
                </Block>
                <Block flex={false} style={{ width: '38%'}}>
                  <Text>
                  <TextCurrency 
                    value={shipmentPrice ? shipmentPrice : 0} /> đ</Text>
                </Block>
              </Block>
              <Block center row space="between">
                <Block flex={false} style={{ width: '60%'}}>
                  <Text green>
                    {`${strings('Cart.subTract')}:`}
                  </Text>
                </Block>
                <Block flex={false} style={{ width: '38%'}}>
                  <Text>
                  <TextCurrency 
                    value={subTract ? subTract : 0} /> đ</Text>
                </Block>
              </Block>
              <Block center row space="between">
                <Block flex={false} style={{ width: '60%'}}>
                  <Text green>
                    {`${strings('Cart.pointPlus')}:`}
                  </Text>
                </Block>
                <Block flex={false} style={{ width: '38%'}}>
                  <Text>{pointPlus ? pointPlus : 0}</Text>
                </Block>
              </Block>
            </Block>
          </ScrollView>
        </Block>
        <Block style={{ 
          backgroundColor: Colors.white, padding: 10
        }}
        >
          <Block center row space="between">
            <Block flex={false} style={{ width: '60%'}}>
              <Text h3 green>
                {`${strings('Cart.sum')}:`}
              </Text>
            </Block>
            <Block flex={false} style={{ width: '38%'}}>
              <Text h3 pink2>
              <TextCurrency 
                pink2 h3 value={finishPrice ? finishPrice : 0} /> đ</Text>
            </Block>
          </Block>
          <Button green onPress={() => this.handleToPayment()}>
            <Text white center h3>{strings('Cart.payMethod')}</Text>
          </Button>
        </Block>
      </Block>
    );
  };

  render() {
    const { errorCode, cart, isOpen } = this.state;
    const { navigation, userActions } = this.props;
    if ( errorCode === '401') {
      resetUser();
      userActions.resetUser();
      navigation.navigate(Screens.LOGIN);
    }
   
    return (
      <Block style={Style.view}>
        <Header 
          title={strings('Cart.headerTitle')}
          isShowBack
          navigation={navigation}
        />
        {cart.totalProduct && cart.totalProduct > 0 ? this.renderContent() : (
          <Block style={Style.container}>
            <Text h3 center>
              {strings('Cart.msgNoProduct')}
            </Text>
            <Button green onPress={() => navigation.navigate(Screens.HOME)}>
              <Text center white>{strings('Cart.continueOrder')}</Text>
            </Button>
          </Block>
        )}
        <Toast
          ref="toastFailed"
          style={{backgroundColor: Colors.accent}}
          position='top'
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
        <BaseModal 
          isOpen={isOpen}
          bodyModal={this.renderBodyModal}
          footerModal={this.renderFooterModal}
          onCancel={this.handleCloseModal} 
          useScrollView={true}
        />
        <BaseModal 
          isOpen={this.state.isOpenPromotion}
          title={strings("Cart.titlePromotion")}
          bodyModal={this.renderBodyModalPromotion}
          onCancel={this.handleCloseModal} 
          useScrollView={true}
        />
      </Block>
    );
  }
}

CartScreen.defaultProps = {};

CartScreen.propTypes = {
  userActions: PropTypes.object,
  cart: PropTypes.object,
  total: PropTypes.number,
  errorCode: PropTypes.string,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  cart: state.cart.cart,
  total: state.cart.total,
  loading: state.branch.loadingProducts,
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  language: state.user.language,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  cartActions: bindActionCreators(CartActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CartScreen);

