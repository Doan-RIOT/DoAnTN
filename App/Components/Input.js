import React, { Component } from 'react'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Text from './Text';
import Block from './Block';
import { Sizes, Colors } from 'App/Theme';

export default class Input extends Component {
  state = {
    toggleSecure: false,
  }

  renderLabel() {
    const { label, labelColor, error, labelStyle } = this.props;
    const color = error ? 'error' : (labelColor ? labelColor : 'green');
    return (
      <Block flex={false}>
        {label ? <Text style={labelStyle} color={color}>{label}</Text> : null}
      </Block>
    )
  }

  renderToggle() {
    const { secure, rightLabel } = this.props;
    const { toggleSecure } = this.state;

    if (!secure) return null;

    return (
      <TouchableOpacity
        style={[styles.toggle, {top: Sizes.base * 2}]}
        onPress={() => this.setState({ toggleSecure: !toggleSecure })}
      >
        {
          rightLabel ? rightLabel :
            <Icon
              color={Colors.gray}
              size={Sizes.font * 1.35}
              name={!toggleSecure ? "md-eye" : "md-eye-off"}
            />
        }
      </TouchableOpacity>
    );
  }

  renderRight() {
    const { rightLabel, rightStyle, onRightPress } = this.props;

    if (!rightLabel) return null;

    return (
      <TouchableOpacity
        style={[styles.toggle, rightStyle]}
        onPress={() => onRightPress && onRightPress()}
      >
        {rightLabel}
      </TouchableOpacity>
    );
  }

  render() {
    const {
      email,
      phone,
      number,
      secure,
      error,
      style,
      ...props
    } = this.props;

    const { toggleSecure } = this.state;
    const isSecure = toggleSecure ? false : secure;

    const inputStyles = [
      styles.input,
      error && { borderColor: Colors.error },
      style,
    ];

    const inputType = email
      ? 'email-address' : number
      ? 'numeric' : phone
      ? 'phone-pad' : 'default';

    return (
      <Block flex={false} margin={[0, 0, 5]}>
        {this.renderLabel()}
        <TextInput
          style={inputStyles}
          secureTextEntry={isSecure}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={inputType}
          {...props}
        />
        {this.renderToggle()}
        {this.renderRight()}
      </Block>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.black,
    borderRadius: Sizes.radius,
    fontSize: Sizes.font,
    // fontWeight: '500',
    color: Colors.black,
    height: Sizes.base * 3,
  },
  toggle: {
    position: 'absolute',
    alignItems: 'flex-end',
    width: Sizes.base * 2,
    height: Sizes.base * 2,
    right: 0,
  },
});