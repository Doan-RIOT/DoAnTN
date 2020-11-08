// just copy this code from the driving repo :)
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Sizes, Colors } from 'App/Theme';
import PropTypes from 'prop-types';
import { Block, Text } from 'App/Components';
import { Checkbox } from 'react-native-paper';

export default class CheckBox extends Component {
  state = {
    checked: this.props.checked
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { checked } = nextProps;
    return { checked };
  }

  handleOnPress = () => {
    const { onPress } = this.props;
    const { checked } = this.state;
    this.setState({
      checked: !checked,
    });
    if (onPress) {
      onPress(!checked);
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
    const { checked } = this.state;
    return (
      <TouchableOpacity 
        onPress={() => this.handleOnPress()}
        disabled={disabled}
      >
        <Block flex={false} row center style={style}>
          <Checkbox.Android
            color={color ? color : Colors.green}
            status={checked ? 'checked' : 'unchecked'}
            disabled={disabled}
            onPress={() => this.handleOnPress()}
            uncheckedColor={uncheckedColor}
          />
          <Text style={[styleTitle, styles.label]}>
            { label }
          </Text>
        </Block>
      </TouchableOpacity>
    );
  }
}

CheckBox.defaultProps = {
  label: '',
  disabled: false,
  checked: false,
};

CheckBox.propTypes = {
  label: PropTypes.string,
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
