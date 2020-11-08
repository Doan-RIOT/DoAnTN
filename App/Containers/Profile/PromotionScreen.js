import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import { TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Button, Block,Text, BaseModal,
  Card, Header, Loading, CheckBox, TextCurrency
} from "../../Components";
import { strings } from '../../Locate/I18n';
import Style from './PromotionScreenStyle';
import { Images, Colors } from '../../Theme'
import { resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import UserActions from '../../Stores/User/Actions';

class PromotionScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      promotion: [],
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, promotion } = nextProps;
    let data = { errorCode, promotion };

    return data;
  }

  onRefresh = () => {
    const { userActions, userId } = this.props;
    userActions.fetchPromotion(userId);
  };

  renderItem = item => {
    const { navigation } = this.props;
    const data = {
      brandName: item.brandName,
      brandId: item.brandId,
      brandImage: item.imageUrl,
      branchId: item.branchId,
    }
    const imageUrl = `${Config.IMAGE_URL}${item.imageUrl}`;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(Screens.BRANCH, data)}
      >
        <Block row space="between" style={Style.container}>
          <Image 
            source={{uri: imageUrl}}
            style={Style.branchImage}
          />
          <Block style={{marginLeft: 10}}>
            <Text h3 green bold>
              {item.branchName ? item.branchName : ''}
            </Text>
            <Text h3>{item.promotionDes ? item.promotionDes : ''}</Text>
          </Block>
        </Block>
      </TouchableOpacity>
    )
  };

  render() {
    // const { loading, userActions, navigation } = this.props;
    // // const { listOrder, refreshing, errorCode, isOpen } = this.state;
    // if ( errorCode === '401') {
    //   this.handleVisibleModal(false);
    //   resetUser();
    //   userActions.resetUser();
    //   navigation.navigate(Screens.WELCOME);
    // }
    const { navigation } = this.props;
    const { refreshing, promotion } = this.state;

    return (
      <Block style={Style.view}>
        <Header 
          title={strings('Promotion.headerTitle')}
          isShowBack
          navigation={navigation}
        />
          <FlatList
            vertical
            scrollEnabled
            showsVerticalScrollIndicator={false}
            snapToAlignment="center"
            data={promotion}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({item}) => this.renderItem(item)}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={refreshing}
                onRefresh={() => this.onRefresh()}
              />
            }
          />
      </Block>
    );
  }
};

PromotionScreen.defaultProps = {};

PromotionScreen.propTypes = {
  errorCode: PropTypes.string,
  userId: PropTypes.string,
  promotion: PropTypes.array,
  userActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  promotion: state.user.promotion,
  userId: state.user.userId,
  language: state.user.language,
  errorCode: state.user.errorCode,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PromotionScreen);

