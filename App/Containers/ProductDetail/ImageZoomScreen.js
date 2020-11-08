import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import {
  Image, TouchableOpacity,
  FlatList, Dimensions,
  ScrollView
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {
  Button, Block,Text, BaseModal, Cart,
  Card, Header, Input, Picker, TextCurrency
} from "../../Components";
import Icon from 'react-native-vector-icons/FontAwesome';
import { ProgressBar } from 'react-native-paper';
import { Badge } from 'react-native-paper';
import { strings } from '../../Locate/I18n';
import Style from './ImageZoomScreenStyle';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import { chunk } from '../../Utils/commonFunction';

const { width, height } = Dimensions.get('window');
const widthCarousel = width - (ApplicationStyles.marginHorizontal.marginHorizontal * 2);

class ImageZoomScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageZoom: [{ url: '', props: { source: Images.product2 }}],
      index: 0,
    }
  }

  componentDidMount = () => {
  }

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
    const { imageZoom, index } = this.state;
    return (
      <Block style={Style.view}>
        <TouchableOpacity style={Style.back} onPress={() => navigation.goBack()}>
          <Text white><Icon name="close" size={25} /></Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={Style.back} onPress={() => this.setState({
          index: 1,
        })}>
          <Text white><Icon name="close" size={25} /></Text>
        </TouchableOpacity> */}
        <ImageViewer
          index={index}
          imageUrls={imageZoom}
          onChange={index => this.setState({
            index,
          })}
        />
      </Block>
    );
  }
}

ImageZoomScreen.defaultProps = {};

ImageZoomScreen.propTypes = {};

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImageZoomScreen);

