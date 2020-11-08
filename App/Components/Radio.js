// just copy this code from the driving repo :)
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Sizes, Colors } from 'App/Theme';
import PropTypes from 'prop-types';
import { Block, Text } from 'App/Components';
import { RadioButton } from 'react-native-paper';

export default class Radio extends Component {
  state = {
    checked: this.props.checked,
    value: this.props.value,
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { checked } = nextProps;
    return { checked };
  }

  handleOnPress = () => {
    const { value } = this.state;
    const { onPress } = this.props;
    if (onPress) {
      onPress(value);
    }
  }

  render() {
    const {
      label,
      color,
      disabled,
      styleTitle,
      style,
      uncheckedColor,
    } = this.props;

    const { checked, value } = this.state;
    return (
      <TouchableOpacity 
        onPress={() => this.handleOnPress()}
        disabled={disabled}
      >
        <Block flex={false} row center style={style}>
          <RadioButton.Android
            color={color ? color : Colors.green}
            status={checked ? 'checked' : 'unchecked'}
            disabled={disabled}
            onPress={() => this.handleOnPress()}
            uncheckedColor={uncheckedColor}
            value={value}
          />
          <Text style={[styleTitle, styles.label]}>
            { label }
          </Text>
        </Block>
      </TouchableOpacity>
    );
  }
}

Radio.defaultProps = {
  label: '',
  disabled: false,
  checked: false,
};

Radio.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  label: {
    width: '80%',
    fontSize: Sizes.base
  }
});
