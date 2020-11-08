import React, { Component } from 'react'
import Input from './Input';
import NumberFormat from 'react-number-format';

export default class InputCurrency extends Component {
  render() {
    const {
      style,
      value,
      onChangeText,
      onBlur,
      prefix,
      placeholder,
      label,
      labelStyle,
      labelColor
    } = this.props;
   
    return (
      <NumberFormat 
        value={value}
        thousandSeparator={true}
        thousandSeparator='.'
        decimalSeparator=','
        prefix={prefix ? prefix :''}
        displayType={'text'}
        renderText={(formattedValue) => (
          <Input
            label={label}
            labelColor={labelColor}
            labelStyle={labelStyle}
            style={style}
            onChangeText={(value) => {
              if(onChangeText)
                onChangeText(value)
            }}
            onBlur={() => {
              if(onBlur)
                onBlur()
            }}
            keyboardType="numeric"
            value={formattedValue}
            placeholder={placeholder}
          />
        )}
      />
    )
  }
}
