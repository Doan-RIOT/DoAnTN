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
import Style from './SignUpScreenStyle';
import UserActions from '../../Stores/User/Actions';
import CardsActions from '../../Stores/Card/Actions';
import CartActions from '../../Stores/Cart/Actions';
import { userService } from '../../Services/UserService';
import { Sizes, Images } from '../../Theme';
import { saveToken, saveUserId, getCart } from '../../Utils/storage.helper';
import { Screens } from '../../Utils/screens';
import { Colors } from '../../Theme'; 

class SignUpScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      errors: [],
      msgError: '',
      username: '',
      password: '',
      passwordConfirm: '',
      gender: '0',
    }
  }

  handleLogin = async () => {
    Keyboard.dismiss();
    const errors = [];
    let msgError = '';
    const { navigation, userActions, cardsActions } = this.props;
    const { username, password, gender, passwordConfirm } = this.state;
    const data = {
      username: username,
      password,
    };

    this.setState({ loading: true });
    const regex = /([0-9])+([0-9]{9})\b/g
    setTimeout(() => {
      if (data.password === '') {
        errors.push("password");
        msgError = strings('Login.msgErrorRequiredPassword');
      } else if (data.password.length < 6) {
        errors.push("password");
        msgError = strings('Login.msgErrorLengthPassword');
      } else if (passwordConfirm === '') {
        errors.push("passwordConfirm");
        msgError = strings('Login.msgErrorRequiredPasswordConfirm');
      } else if (passwordConfirm !== data.password) {
        errors.push("passwordConfirm");
        msgError = strings('Login.msgErrorPasswordConfirm');
      }
      this.setState({ errors, msgError, loading: false });

      if (errors.length === 0) {
        try {
          userService.signUp(data)
          .then(response => {
            if (response.email) {
              // console.log('signup',response)
              navigation.navigate(Screens.LOGIN);
            }else if (response.message === 'Conflict') {
              this.refs.toastFailed.show("Tài khoản đã tồn tại", DURATION.LENGTH_LONG);
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
    const { loading, errors, gender, msgError } = this.state
    const hasErrors = (key) => (errors.includes(key) ? Style.hasErrors : null)

    return (
        <ImageBackground source={Images.farmImage} style={Style.image}>
          <Header 
            title={strings('Login.signUp')}
            isShowBack
            navigation={navigation}
          />
          <Block padding={[0, Sizes.base * 2]}>
            <Block style={{marginVertical: 100}}>
              <Text error>{msgError}</Text>
              <Input
                label={"Email"}
                error={hasErrors('username')}
                style={[Style.input, hasErrors('username')]}
                value={this.state.username}
                onChangeText={(text) => this.setState({ username: text })}
                labelColor ='white'
              />
              <Input
                secure
                label={strings('Login.password')}
                error={hasErrors('password')}
                style={[Style.input, hasErrors('password')]}
                value={this.state.password}
                onChangeText={(text) => this.setState({ password: text })}
                labelColor ='white'
              />
              <Input
                secure
                label={strings('Login.passwordConfirm')}
                error={hasErrors('passwordConfirm')}
                style={[Style.input, hasErrors('passwordConfirm')]}
                value={this.state.passwordConfirm}
                onChangeText={(text) => this.setState({ passwordConfirm: text })}
                labelColor ='white'
              />
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

SignUpScreen.propTypes = {
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
)(SignUpScreen);
