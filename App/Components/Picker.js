// just copy this code from the driving repo :)
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Sizes, Colors } from 'App/Theme';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-native-material-dropdown';

export default class Picker extends Component {

  handleChange = (value, index) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value, index);
    }
  }

  render() {
    const {
      label,
      data,
      selectedValue,
      containerStyle,
      pickerStyle,
      fontSize,
      baseColor,
      color,
      labelFontSize,
    } = this.props;

    return (
      <Dropdown
        label={label}
        value={selectedValue}
        data={data}
        labelFontSize={labelFontSize ? labelFontSize : Sizes.h3}
        fontSize={fontSize ? fontSize : Sizes.h2 }
        baseColor={baseColor}
        textColor={color}
        containerStyle={[containerStyle, styles.containerStyle]}
        pickerStyle={[pickerStyle, styles.pickerStyle]}
        onChangeText={(value, index) => this.handleChange(value, index)}
        dropdownPosition={20, 2}
      />
    );
  }
}

Picker.defaultProps = {
  label: '',
  data: []
};

Picker.propTypes = {
  label: PropTypes.string,
  data: PropTypes.array,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  containerStyle: PropTypes.object,
  pickerStyle: PropTypes.object,
  fontSize: PropTypes.number,
  baseColor: PropTypes.string,
  color: PropTypes.string,
  labelFontSize: PropTypes.number,
  onChange: PropTypes.func
};

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
  },
  pickerStyle: {
    borderColor: Colors.gray,
    borderWidth: 0.5,
  },
});
