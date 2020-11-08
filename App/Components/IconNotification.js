import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from 'App/Theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Badge } from 'react-native-paper';
import { Screens } from '../Utils/screens';
import { cartService } from '../Services/CartService';
import CartActions from '../Stores/Cart/Actions';

class Cart extends Component {
  handleToCart = navigation => {
    let { total, cart, language, userId, cartActions } = this.props;
    if (total > 0) {
      cartService.createOrders(cart, language).then(response => {
        if (response.success) {
          const data = response.data && response.data !== null ? response.data : {};
          cartActions.setDataToCart(data, total, userId);
          navigation.navigate(Screens.CART);
        }
      }).catch(error =>{});
    } else {
      navigation.navigate(Screens.CART);
    }
  };

  render() {
    const {
      total, navigation
    } = this.props;
    return (
      <TouchableOpacity 
        onPress={() => this.handleToCart(navigation)}
      >
        <Icon
          name="shopping-cart"
          style={styles.cartIcon}
          size={30}
          
        />
        {total && total > 0 ? (
          <Badge
            style={{ position: 'absolute', top: -5, right: -5 }}
          >{total}</Badge>
        ) : null}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cartIcon: {
    color: Colors.white,
  },
});

Cart.propTypes = {
  total: PropTypes.number,
}

const mapStateToProps = (state) => ({
  cart: state.cart.cart,
  total: state.cart.total,
  userId: state.user.userId,
  language: state.user.language,
})

const mapDispatchToProps = (dispatch) => ({
  cartActions: bindActionCreators(CartActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cart);
