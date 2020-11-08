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
import { Button, Block, Text, Input, Header, Radio } from '../../Components';
import Style from './ActiveScreenStyle';
import UserActions from '../../Stores/User/Actions';
import CardsActions from '../../Stores/Card/Actions';
import CartActions from '../../Stores/Cart/Actions';
import { userService } from '../../Services/UserService';
import { Sizes, Images } from '../../Theme';
import { saveToken, saveUserId, getCart } from '../../Utils/storage.helper';
import { Screens } from '../../Utils/screens';
import { Colors } from '../../Theme'; 

class ActiveScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      errors: [],
      otp: '',
    }
  }

  handleLogin = async () => {
    Keyboard.dismiss();
    const errors = [];
    const { navigation, userActions, cardsActions } = this.props;
    const { username, password, gender } = this.state;
    const data = {
      username: username,
      password,
      gender,
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
          userService.signUp(data).then(response => {
            console.log(response);
            if (response.success) {
              // const { token, customerId } = response.data;
              // const userInfo = {
              //   token,
              //   userId: customerId,
              // };
              // userActions.setInfoUser(userInfo);
              // saveToken(token);
              // saveUserId(customerId);
              // userActions.fetchProfile(customerId);
              // userActions.fetchAddress(customerId);
              // cardsActions.fetchCards(customerId);
              // userActions.fetchHistoriesOrder(customerId);
              navigation.navigate(Screens.HOME);
            } else {
              this.refs.toastFailed.show(strings('Login.msgSignUpFailed'), DURATION.LENGTH_LONG);
            }
          });
        } catch (error) {
          this.refs.toastFailed.show(strings('Login.msgSignUpFailed'), DURATION.LENGTH_LONG);
        }
      }
    }, 1000);
  }

  render() {
    const { navigation } = this.props
    const { loading, errors, gender } = this.state
    const hasErrors = (key) => (errors.includes(key) ? Style.hasErrors : null)

    return (
        <ImageBackground source={Images.backgroundLogin} style={Style.image}>
          <Header 
            title={strings('Login.signUp')}
            isShowBack
            navigation={navigation}
          />
          <Block padding={[0, Sizes.base * 2]}>
            <Block style={{marginVertical: 100}}>
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
              <Block flex={false} row>
                <Radio
                  label={strings('UserInfo.male')}
                  value="0"
                  color={Colors.pink2}
                  styleTitle={Style.radio}
                  uncheckedColor={Colors.green}
                  checked={gender === '0'}
                  onPress={value => this.setState({ gender: value })}
                  style={{ width : 100 }}
                />
                <Radio
                  label={strings('UserInfo.female')}
                  value="1"
                  color={Colors.pink2}
                  styleTitle={Style.radio}
                  uncheckedColor={Colors.green}
                  checked={gender === '1'}
                  onPress={value => this.setState({ gender: value })}
                />
            </Block>
              <Button gradient onPress={() => this.handleLogin()}>
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text bold white center>
                    {strings('Login.signUp')}
                  </Text>
                )}
              </Button>
              <Block flex={false} center middle row>
                <Text>{`${strings('Login.haveAccount')} `}</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate(Screens.LOGIN)}
                    >
                    <Text
                      green 
                      style={{ textDecorationLine: 'underline' }}
                    >
                      {strings('Login.login')}
                    </Text>
                </TouchableOpacity>
              </Block>
            </Block>
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

ActiveScreen.propTypes = {
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
)(ActiveScreen);
