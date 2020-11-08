import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { StyleSheet  } from "react-native";
import Block from './Block';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Badge } from 'react-native-paper';

class IconFavorites extends Component {
  
  render() {
    const {
      color,
      favorites,
    } = this.props;
    
    let count = 0;
    if (favorites.brand) count += favorites.brand.length;
    if (favorites.product) count += favorites.product.length;

    return (
      <Block center flex={false}>
        <Icon name='heart' size={22} color={color} />
        <Badge
          style={styles.icon}
        >{count}</Badge>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: -4, 
    left: 9
  },
});

IconFavorites.propTypes = {
  color: PropTypes.string,
  favorites: PropTypes.object
}

const mapStateToProps = (state) => ({
  favorites: state.user.favorites,
})

export default connect(
  mapStateToProps,
  null,
)(IconFavorites);
