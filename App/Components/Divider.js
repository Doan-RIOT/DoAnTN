import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import Block from './Block';
import { Sizes, Colors, Fonts } from 'App/Theme';

export default class Divider extends Component {
  render() {
    const { color, style, ...props } = this.props;
    const dividerStyles = [
      styles.divider,
      style,
    ];

    return (
      <Block
        color={color || Colors.gray2}
        style={dividerStyles}
        {...props}
      />
    )
  }
}

export const styles = StyleSheet.create({
  divider: {
    height: 0,
    margin: Sizes.base * 2,
    borderBottomColor: Colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
})
