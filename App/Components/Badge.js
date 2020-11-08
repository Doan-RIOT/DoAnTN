import React, { Component } from 'react'
import { StyleSheet } from 'react-native'

import Block from './Block';
import { Sizes } from 'App/Theme';

export default class Badge extends Component {
  render() {
    const { children, style, size, color, ...props } = this.props;

    const badgeStyles = StyleSheet.flatten([
      styles.badge,
      size && {
        height: size,
        width: size,
        borderRadius: size,
      },
      style,
    ]);

    return (
      <Block flex={false} middle center color={color} style={badgeStyles} {...props}>
        {children}
      </Block>
    )
  }
}

const styles = StyleSheet.create({
  badge: {
    height: Sizes.base,
    width: Sizes.base,
    borderRadius: Sizes.border,
  }
})
