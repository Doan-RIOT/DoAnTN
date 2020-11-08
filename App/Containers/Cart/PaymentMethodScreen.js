import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import {
  Image, Dimensions, ScrollView,
} from 'react-native';
import UserActions from '../../Stores/User/Actions';
import CartActions from '../../Stores/Cart/Actions';
import { Block, Text, Radio, Header, Button, TextCurrency } from "../../Components";
import Icon from 'react-native-vector-icons/FontAwesome';
import { strings } from '../../Locate/I18n';
import Style from './PaymentMethodScreenStyle';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { chunk } from '../../Utils/commonFunction';
import { resetUser } from '../../Utils/storage.helper';
import { Screens } from '../../Utils/screens';
import { Config } from '../../Config/index'
import { Constants } from '../../Utils/constants';
import { saveCart } from '../../Utils/storage.helper';
const { height, width } = Dimensions.get('window');
import { cartService } from '../../Services/CartService';


class PaymentMethodScreen extends Component {
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

  handlePayment = () => {
    const { language, cartActions, userActions, userId, navigation } = this.props;
    let { cart } = this.state;
    cart.orderType = 'SALES_ORDER';
    cart.paymentMethodId = '1';
    cartService.createOrders(cart, language).then(response => {
      if (response.success) {
        const data = response.data && response.data !== null ? response.data : {};
        cartActions.setDataToCart({}, 0, userId);
        userActions.fetchHistoriesOrder(userId);
        navigation.navigate(Screens.ORDER_SUCCESS, { cart: data });
      } else {
        this.refs.toastFailed.show(strings('Cart.msgPaymentFailed'), DURATION.LENGTH_LONG);
      }
    }).catch(error =>{
      this.refs.toastFailed.show(strings('Cart.msgPaymentFailed'), DURATION.LENGTH_LONG);
    });
  };

  render() {
    const { errorCode, cart } = this.state;
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
        <ScrollView>
          {/* <Block flex={false} style={Style.container}>
            <Radio
              label={strings('Cart.payByVisa')}
              value={''}
              color={Colors.pink2}
              uncheckedColor={Colors.green}
              checked={false}
              // onPress={() => {}}
            />
            <Block flex={false} row>
              <Image 
                source={Images.visa}
                style={Style.image}
                resizeMode="contain"
              />
              <Text style={{ marginLeft: 10 }}>****7430</Text>
            </Block>
          </Block> */}
          <Block flex={false} style={Style.container}>
            <Radio
              label={strings('Cart.payByCod')}
              value={''}
              color={Colors.pink2}
              uncheckedColor={Colors.green}
              checked={true}
              // onPress={() => {}}
            />
            <Block flex={false}>
              <Image 
                source={Images.cod}
                style={Style.image}
                resizeMode="contain"
              />
            </Block>
          </Block>
          {/* <Block flex={false} style={Style.container}>
            <Radio
              label={strings('Cart.payByWallet')}
              value={''}
              color={Colors.pink2}
              uncheckedColor={Colors.green}
              checked={false}
              // onPress={() => {}}
            />
            <Block flex={false} row>
              <Image 
                source={Images.wallet}
                style={[Style.image, { height : 30 }]}
                resizeMode="contain"
              />
              <Image 
                source={Images.momo}
                style={[Style.image, { height : 30 }]}
                resizeMode="contain"
              />
            </Block>
          </Block> */}
        </ScrollView>
        <Block flex={false} style={{ position: 'absolute' , left: 0, right: 0, bottom: 0, backgroundColor: Colors.white, padding: 10, height: height * 0.2 }}>
          <Block center row space="between">
            <Block flex={false} style={{ width: '60%'}}>
              <Text green h3>
                {`${strings('Cart.sum')}:`}
              </Text>
            </Block>
            <Block flex={false} style={{ width: '38%'}}>
              <Text h3 pink2 right>
              <TextCurrency 
                h3 pink2 value={cart.finishPrice ? cart.finishPrice : 0} /> đ</Text>
            </Block>
          </Block>
          <Button green onPress={() => this.handlePayment()}>
            <Text white center h3>{strings('Cart.pay')}</Text>
          </Button>
        </Block>
        <Toast
          ref="toastFailed"
          style={{backgroundColor: Colors.accent}}
          position='top'
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
      </Block>
    );
  }
}

PaymentMethodScreen.defaultProps = {};

PaymentMethodScreen.propTypes = {
  userActions: PropTypes.object,
  total: PropTypes.number,
  errorCode: PropTypes.string,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
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
)(PaymentMethodScreen);

