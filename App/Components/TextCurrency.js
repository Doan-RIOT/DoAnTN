import React, { Component } from 'react'
import Text from './Text';
import NumberFormat from 'react-number-format';

export default class TextCurrency extends Component {
  render() {
    const {
      value,
      prefix,
    } = this.props;
   
    return (
      <NumberFormat 
        value={value}
        thousandSeparator='.'
        decimalSeparator=','
        prefix={prefix ? prefix :''}
        displayType={'text'}
        renderText={(formattedValue) => (
          <Text
            {...this.props}
          >
            {formattedValue}
          </Text>
        )}
      />
    )
  }
}