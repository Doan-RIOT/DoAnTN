import React, { Component } from 'react';
import { ActivityIndicator , StyleSheet } from 'react-native';
import { Colors } from 'App/Theme';

export default class Loading extends Component {
  render() {
    const { color, size, style } = this.props;
    const loadingStyles = [
      styles.loading,
      style,
    ];
    return (
      <ActivityIndicator color={color || Colors.green} size={size || 'large'} style={loadingStyles} />
    )
  }
}

export const styles = StyleSheet.create({
  loading: {
    marginTop: 10,
  },
})

