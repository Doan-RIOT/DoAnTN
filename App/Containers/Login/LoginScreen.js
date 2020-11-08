import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
  Keyboard,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import { strings } from '../../Locate/I18n';
import { Button, Block, Text, Input } from '../../Components';
import Style from './LoginScreenStyle';
import UserActions from '../../Stores/User/Actions';
import CardsActions from '../../Stores/Card/Actions';
import CartActions from '../../Stores/Cart/Actions';
import { userService } from '../../Services/UserService';
import { cartService } from '../../Services/CartService';
import { Sizes, Images } from '../../Theme';
import { saveToken, saveUserId, getCart, removeStorageItem } from '../../Utils/storage.helper';
// import messaging from '@react-native-firebase/messaging';
import { Screens } from '../../Utils/screens';
import { Colors } from '../../Theme'; 
import { Constants } from '../../Utils/constants';
import { mergeCart } from '../../Utils/commonFunction';

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      errors: [],
      username: '0988722169',
      password: '123456',
      // username: '',
      // password: '',
    }
  }

  handleGetDataCart = async customerId => {
    const { cartActions } = this.props;
    const dataCart = await getCart(customerId);
    const dataCartAnonymous = await getCart('');
    cartService.fetchCart(customerId, Constants.VI).then(response => {
      if (response.success) {
        const data = response.data ? response.data : {};
        let temp = {};
        if (dataCart !== null) {
          const dataCartParse = JSON.parse(dataCart);
          temp = mergeCart(data, dataCartParse.cart);
        }
        if (dataCartAnonymous !== null) {
          const dataCartAnonymousParse = JSON.parse(dataCartAnonymous);
          temp = mergeCart(temp, dataCartAnonymousParse.cart);
          removeStorageItem(`${Constants.CART}_`);
        }
        const total = temp.totalProduct ? temp.totalProduct : 0;
        temp.customerId = customerId;
        cartActions.setDataToCart(temp, total, customerId);
      } else {
        if (dataCart !== null) {
          const dataCartParse = JSON.parse(dataCart);
          const { cart, total } =  dataCartParse;
          cartActions.setDataToCart(cart, total, customerId);
        } else {
          cartActions.setDataToCart({}, 0, customerId);
        }
      }
    });
  };

  requestUserPermission = async userId => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      messaging().getToken().then(token => {
        if (userId && userId !== '') {
          this.saveTokenToDatabase(userId, token);
        }
      });
    }
  };

  saveTokenToDatabase = (userId, token) => {
    const data = {
      customerId: userId,
      token,
    };

    try {
      userService.saveToken(data);
    } catch (error) {}
  };

  handleLogin = async () => {
    Keyboard.dismiss();
    const errors = [];
    const { navigation, userActions, cardsActions, favoritesActions } = this.props;
    const { username, password } = this.state;
    const data = {
      username,
      password,
    };

    this.setState({ loading: true });

    setTimeout(() => {
      if (data.username == "") {
        errors.push("username");
      }
      if (data.password == "") {
        errors.push("password");
      }
      if (data.password.length < 3) {
        errors.push("password");
      }
      this.setState({ errors, loading: false });

      if (errors.length) {
        console.log("has errors");
      } else {
        try {
          userService.login(data).then(response => {
            if (response.success) {
              const { token, customerId } = response.data;
              const userInfo = {
                token,
                userId: customerId,
                username
              };
              this.requestUserPermission(customerId);
              userActions.setInfoUser(userInfo);
              saveToken(token);
              saveUserId(customerId);
              this.handleGetDataCart(customerId);
              userActions.fetchProfile(customerId);
              userActions.fetchAddress(customerId);
              cardsActions.fetchCards(customerId);
              userActions.fetchHistoriesOrder(customerId);
              userActions.fetchPromotion(customerId);
              userActions.fetchFavorites(customerId);
              navigation.navigate(Screens.HOME);
            } else {
              this.refs.toastFailed.show(strings('Login.msgLoginFailed'), DURATION.LENGTH_LONG);
            }
          });
        } catch (error) {
          this.refs.toastFailed.show(strings('Login.msgLoginFailed'), DURATION.LENGTH_LONG);
        }
      }
    }, 1000);
  }

  render() {
    const { navigation } = this.props
    const { loading, errors } = this.state
    const hasErrors = (key) => (errors.includes(key) ? Style.hasErrors : null)

    return (
      <ImageBackground source={Images.backgroundLogin} style={Style.image}>
        <Block padding={[0, Sizes.base * 2]}>
          <Block flex={false}>
            <Text h1 bold center style={{ marginTop: 40 }}>
              FiboCart
            </Text>
          </Block>
          <Block middle style={{marginVertical: 10}}>
            <Input
              label={strings('Login.phoneNumber')}
              error={hasErrors('username')}
              style={[Style.input, hasErrors('username')]}
              value={this.state.username}
              onChangeText={(text) => this.setState({ username: text })}
            />
            <Input
              secure
              label={strings('Login.password')}
              error={hasErrors('password')}
              style={[Style.input, hasErrors('password')]}
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
            />
            <Button gradient onPress={() => this.handleLogin()}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text bold white center>
                  {strings('Login.login')}
                </Text>
              )}
            </Button>
            <Block flex={false} center middle row>
              <Text>{`${strings('Login.noAccount')} `}</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate(Screens.SIGNUP)}
                  >
                  <Text
                    green 
                    style={{ textDecorationLine: 'underline' }}
                  >
                    {strings('Login.signUp')}
                  </Text>
              </TouchableOpacity>
            </Block>
          </Block>
          <TouchableOpacity>
            <Text center green style={{ textDecorationLine: 'underline', marginBottom: 20 }}>
              {strings('Login.forgotPassword')}
            </Text>
          </TouchableOpacity>
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
      </ImageBackground>
    )
  }
}

LoginScreen.propTypes = {
  userActions: PropTypes.object,
  cardsActions: PropTypes.object,
  cartActions: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  cardsActions: bindActionCreators(CardsActions, dispatch),
  cartActions: bindActionCreators(CartActions, dispatch),
})

export default connect(
  null,
  mapDispatchToProps
)(LoginScreen);
