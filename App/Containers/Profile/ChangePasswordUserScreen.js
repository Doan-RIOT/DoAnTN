import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes, { string } from "prop-types";
import Toast, { DURATION } from "react-native-easy-toast";
import { Screens } from "../../Utils/screens";
import {
  Button,
  Block,
  Text,
  BaseModal,
  Card,
  Header,
  Loading,
  CheckBox,
  TextCurrency,
  Input,
  Radio,
} from "../../Components";
import { strings } from "../../Locate/I18n";
import Style from "./ChangePasswordUserStyle";
import { Images, Colors } from "../../Theme";
import UserActions from "../../Stores/User/Actions";
import CartActions from "../../Stores/Cart/Actions";
import { userService } from "../../Services/UserService";
import { resetUser } from "../../Utils/storage.helper";

export class ChangePasswordUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgError: "",
      errors: [],
      passwordOld: "",
      passwordNew: "",
      passwordConfirm: "",
    };
  }

  handleSave = () => {
    const { user } = this.props;
    let { passwordOld, passwordNew, passwordConfirm } = this.state;
    const { language, navigation } = this.props;
    let errors = [];
    let msgError = "";
    const data = {
      customerId: user.userId,
      username: user.username,
      password: passwordOld,
      passwordNew: passwordNew,
    };
    if (passwordOld === "" || passwordOld === null) {
      errors.push("passwordOld");
      msgError = strings("UserInfo.msgErrorRequiredPasswordOld");
    } else if (passwordNew === "" || passwordNew === null) {
      errors.push("passwordNew");
      msgError = strings("UserInfo.msgErrorRequiredPasswordNew");
    } else if (passwordConfirm === "" || passwordConfirm === null) {
      errors.push("passwordConfirm");
      msgError = strings("UserInfo.msgErrorRequiredPasswordConfirm");
    }
    if (passwordNew != passwordConfirm) {
      errors.push("passwordConfirm");
      msgError = strings("UserInfo.msgErrorDifferentPasswordConfirm");
    }
    this.setState({
      msgError,
      errors,
    });

    if (errors.length === 0) {
      try {
        userService.changePassword(data, language).then((response) => {
          if (response.success) {
            this.refs.toastSuccess.show(
              strings("UserInfo.msgChangePasswordSuccess"),
              DURATION.LENGTH_LONG
            );
            this.setState({
              passwordOld: "",
              passwordNew: "",
              passwordConfirm: "",
            });
            resetUser();
            navigation.navigate(Screens.LOGIN);
          } else if (response.errorCode === "401") {
            resetUser();
            navigation.navigate(Screens.LOGIN);
          } else {
            this.refs.toastFailed.show(
              strings("UserInfo.msgChangePasswordNotExit"),
              DURATION.LENGTH_LONG
            );
          }
        });
      } catch (error) {
        this.refs.toastFailed.show(
          strings("UserInfo.msgChangePasswordFailed"),
          DURATION.LENGTH_LONG
        );
      }
    }
  };

  render() {
    const {navigation} = this.props;
    const {msgError, errors ,passwordOld, passwordConfirm ,passwordNew} = this.state;
    const hasErrors = (key) => (errors.includes(key) ? Style.hasErrors : null)
    return (
      <Block style={Style.view}>
        <Header
          title={strings("Profile.headerTitleChangePassword")}
          isShowBack
          navigation={navigation}
        />
        <Block flex={false} style={Style.container}>
          <Text error>{msgError}</Text>
          <Input
            secure
            label={strings('Login.passwordOld')}
            error={hasErrors('passwordOld')}
            style={Style.input}
            value={passwordOld}
            onChangeText={(passwordOld) => this.setState({passwordOld})}
          />
          <Input
            secure
            label={strings("Login.passwordNew")}
            error={hasErrors("passwordNew")}
            style={[Style.input, hasErrors("passwordNew")]}
            value={passwordNew}
            onChangeText={(passwordNew) => this.setState({ passwordNew })}
          />
          <Input
            secure
            label={strings("Login.passwordConfirm")}
            error={hasErrors("passwordConfirm")}
            style={[Style.input, hasErrors("passwordConfirm")]}
            value={passwordConfirm}
            onChangeText={(passwordConfirm) =>
              this.setState({ passwordConfirm })
            }
          />
          <Block flex={false} center style={{ paddingTop: 20 }}>
            <Button
              green
              onPress={() => this.handleSave()}
              style={Style.button}
            >
              <Text bold white center style={{ padding: 10 }}>
                {strings("UserInfo.save")}
              </Text>
            </Button>
            <Button
              error
              onPress={() => navigation.goBack()}
              style={Style.button}
            >
              <Text bold white center style={{ padding: 10 }}>
                {strings("Modal.cancel")}
              </Text>
            </Button>
          </Block>
        </Block>
        <Toast
          ref="toastSuccess"
          style={{ backgroundColor: Colors.green }}
          position="top"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
        <Toast
          ref="toastFailed"
          style={{ backgroundColor: Colors.accent }}
          position="top"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
      </Block>
    );
  }
}

ChangePasswordUserScreen.defaultProps = {};

ChangePasswordUserScreen.propTypes = {
  userActions: PropTypes.object,
  profile: PropTypes.object,
  errorCode: PropTypes.string,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  language: state.user.language,
  user : state.user,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePasswordUserScreen);
