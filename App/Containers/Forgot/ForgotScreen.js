import React, { Component } from "react";
import {
  Keyboard,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import { Sizes } from '../../Theme';
import { Button, Block, Text, Input } from "../../Components";
import { Screens } from '../../Utils/screens';
import Style from './ForgotScreenStyle';

const VALID_EMAIL = "yle@email.com";

class ForgotScreen extends Component {
  state = {
    email: VALID_EMAIL,
    errors: [],
    loading: false
  };

  handleForgot() {
    const { navigation } = this.props;
    const { email } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    //check with backend API or with some static data
    setTimeout(() => {
      if (email !== VALID_EMAIL) {
        errors.push("email");
      }

      this.setState({ errors, loading: false });

      if (errors.length) {
        console.log("has errors");
        Alert.alert(
          "Error!",
          "Please check your Email address.",
          [
            {
              text: "Try again"
            }
          ],
          { cancelable: false }
        );
      } else {
        console.log("no errors");
        // navigation.navigate("Browse");
        Alert.alert(
          "Password sent !",
          "Please check your email.",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate(Screens.LOGIN);
              }
            }
          ],
          { cancelable: false }
        );
      }
    }, 2000);
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => (errors.includes(key) ? Style.hasErrors : null);

    return (
      <KeyboardAvoidingView style={Style.forgot} behavior="padding">
        <Block padding={[0, Sizes.base * 2]}>
          <Text h1 bold>
            Forgot
          </Text>
          <Block middle>
            <Input
              label="Email"
              error={hasErrors("email")}
              style={[Style.input, hasErrors("email")]}
              defaultValue={this.state.email}
              onChangeText={text => this.setState({ email: text })}
            />
            <Button gradient onPress={() => this.handleForgot()}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text bold white center>
                  Forgot
                </Text>
              )}
            </Button>

            <Button onPress={() => navigation.navigate(Screens.LOGIN)}>
              <Text
                gray
                caption
                center
                style={{ textDecorationLine: "underline" }}
              >
                Back to Login
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  }
}

export default ForgotScreen;