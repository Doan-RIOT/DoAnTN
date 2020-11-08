import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import {
  Image, Dimensions, ScrollView,
} from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import Carousel from 'react-native-snap-carousel';
import UserActions from '../../Stores/User/Actions';
import { Block, Text, Radio, Header, Button, TextCurrency } from "../../Components";
import CartActions from '../../Stores/Cart/Actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { sortBy } from 'lodash';
import { strings } from '../../Locate/I18n';
import Style from './OrderSuccessScreenStyle';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { chunk } from '../../Utils/commonFunction';
import { resetUser } from '../../Utils/storage.helper';
import { Screens } from '../../Utils/screens';
import { Config } from '../../Config/index'
import { Constants } from '../../Utils/constants';
import { saveCart } from '../../Utils/storage.helper';
const { height, width } = Dimensions.get('window');
import { cartService } from '../../Services/CartService';


class OrderSuccessScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errorCode: '',
      cart: {},
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, navigation } = nextProps;
    const { cart } = navigation.state.params;
    let data = { errorCode, cart };
    return data;
  }

  componentDidMount = () => {};

  renderItemOrderBranch = (items, branchName) => {
    let htmlItems = [];
    items.forEach((item, index) => {
      const { imageUrl, productName, salePrice, orderNumber, productId } = item;
      const htmlItem = (
        <Block row key={productId}>
          <Block flex={false} style={{ width: '30%' }}>
            <Image 
              source={{ uri: `${Config.IMAGE_URL}${imageUrl}` }}
              style={Style.productImage}
            />
          </Block>
          <Block flex={false} style={{ width: '70%', paddingHorizontal: 10 }}>
            <Text bold h3>{productName}</Text>
            <Text h3 gray>{`${strings('ProductDetail.provider')}: ${branchName}`}</Text>
            <Text h3 gray>{`${strings('ProductDetail.productCode')}: `}</Text>
            <Text h3><TextCurrency h3 bold pink2 value={salePrice} /> <Text bold pink2 h3>đ</Text> x {orderNumber}</Text>
          </Block>
        </Block>
      )
      htmlItems.push(htmlItem);
    });

    return (
      <Block flex={false}>
        {htmlItems}
      </Block>
    );
  };

  renderOrderBranch = orderBranch => {
    const {
      branchName, items, branchId, orderId,
      orderStatusString, estimatedShipDate, orderStatusId
    } = orderBranch;
    return (
      <Block key={branchId} style={{ marginBottom: 20}}>
        {items.length > 0 ? (
          <>
            <Text h3 bold>
              {`${strings('ListOrder.Order')}: #${orderId ? orderId : '' }`}
            </Text>
            <Text h3 green bold>{branchName}</Text>
            {this.renderItemOrderBranch(items, branchName)}
            <Text h3 gray>
              {`${strings('ListOrder.statusOrder')}: `}
              <Text h3 color={orderStatusId && orderStatusId === 'ORDER_CANCELLED' ? Colors.pink2 : Colors.green}>
                {orderStatusString ? orderStatusString : ''}
              </Text>
            </Text>
            <Text h3 gray>
              {`${strings('Cart.estimationDate')}: `}
              <Text h3 gray>
                {estimatedShipDate ? estimatedShipDate : ''}
              </Text>
            </Text>
          </>
        ) : null}
      </Block>
    )
  };

  renderProductsOrder = () => {
    const { cart } = this.state;
    const { orderForBranch } = cart;
    let htmlProductsOrder = [];
    if (orderForBranch && orderForBranch.length > 0) {
      for (let index = 0; index < orderForBranch.length; index +=1) {
        const orderBranch = orderForBranch[index];
        const htmlOderBranch = this.renderOrderBranch(orderBranch);
        htmlProductsOrder.push(htmlOderBranch);
      }
    }
    
    return htmlProductsOrder;
  };

  render() {
    const { errorCode, cart } = this.state;
    const { navigation, userActions } = this.props;
    const { receiverName, receiverPhone, receiveAddr } = cart;

    if ( errorCode === '401') {
      resetUser();
      userActions.resetUser();
      navigation.navigate(Screens.LOGIN);
    }
   
    return (
      <Block style={Style.view}>
        <Header 
          title={strings('Cart.cart')}
          navigation={navigation}
        />
        <Block flex={false} style={{ height: height >= 720 ? height * 0.8: height * 0.77, paddingBottom: 5 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <Block flex={false} style={Style.container}>
              <Text h2 center bold green>{strings('Cart.titleOrderSuccess')}</Text>
            </Block>
            <Block style={Style.container}>
              <Block flex={false} style={Style.item}>
                <Text h3 green>
                  {`${strings('ListOrder.Order')}: #${cart.id ? cart.id : '' }`}
                </Text>
                <Text h3 gray>
                  {`${strings('ListOrder.timeOrder')}: `}
                  <Text h3 gray>
                    {cart.orderDate ? cart.orderDate : ''}
                  </Text>
                </Text>
                <Text h3 gray>
                  {`${strings('ListOrder.statusOrder')}: `}
                  <Text h3 green>
                    {cart.orderStatusString ? cart.orderStatusString : ''}
                  </Text>
                </Text>
              </Block>
              <Block flex={false} style={Style.item}>
                <Text h3 green>
                  {strings('Cart.addressReceiver')}
                </Text>
                <Text h3 gray>
                  {`${receiverName ? receiverName : ''}${receiverPhone ? ` - ${receiverPhone}`: ''}`}
                </Text>
                <Text h3 gray>
                  {receiveAddr ? receiveAddr : ''}
                </Text>
              </Block>
              <Block flex={false} style={Style.item}>
                {this.renderProductsOrder()}
              </Block>
              <Block flex={false} style={Style.item} row>
                <Block flex={false} style={{width: '40%'}}>
                <Text h3 gray>{`${strings('Cart.tempPrice')}:`}</Text>
                  <Text h3 gray>{`${strings('Cart.subTract')}:`}</Text>
                  <Text h3 gray>{`${strings('DetailOrder.usePoint')}:`}</Text>
                  <Text h3 gray>
                    {`${strings('Cart.shipPrice')}:`}
                  </Text>
                </Block>
                <Block flex={false} style={{width: '60%'}}>
                  <Text h3 right><TextCurrency h3 value={cart.tempPrice ? cart.tempPrice : 0}/> đ</Text>
                  <Text h3 right><TextCurrency h3 value={cart.subTract ? cart.subTract : 0}/> đ</Text>
                  <Text h3 right>{`${cart.pointToPay ? cart.pointToPay : 0} ${strings('Cart.msgNowPointsRight')}`}</Text>
                  <Text h3 right><TextCurrency h3 value={cart.shipmentPrice ? cart.shipmentPrice : 0}/> đ</Text>
                </Block>
              </Block>
              <Block flex={false} style={[Style.item, {borderBottomWidth: 0}]} row>
                <Block flex={false} style={{width: '40%'}}>
                  <Text h3 gray>{`${strings('Cart.sum')}:`}</Text>
                </Block>
                <Block flex={false} style={{width: '60%'}}>
                  <Text h3 pink2 right><TextCurrency h3 pink2 value={cart.finishPrice ? cart.finishPrice : 0}/> đ</Text>
                </Block>
              </Block>
            </Block>
          </ScrollView>
        </Block>
        <Block style={{ position: 'absolute' , left: 0, right: 0, bottom: 0, backgroundColor: Colors.white, padding: 10, height: height * 0.12 }}>
          <Button green onPress={() => navigation.navigate(Screens.HOME)}>
            <Text white center h3>{strings('Cart.continueOrder')}</Text>
          </Button>
        </Block>
      </Block>
    );
  }
}

OrderSuccessScreen.defaultProps = {};

OrderSuccessScreen.propTypes = {
  userActions: PropTypes.object,
  total: PropTypes.number,
  errorCode: PropTypes.string,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  loading: state.branch.loadingProducts,
  errorCode: state.user.errorCode,
  userId: state.user.userId,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderSuccessScreen);

