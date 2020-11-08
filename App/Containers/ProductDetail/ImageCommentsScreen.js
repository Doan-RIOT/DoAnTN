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
import IconIonic from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ProgressBar } from 'react-native-paper';
import { Badge } from 'react-native-paper';
import { strings } from '../../Locate/I18n';
import Style from './ImageCommentsScreenStyle';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import { chunk } from '../../Utils/commonFunction';

const { width, height } = Dimensions.get('window');
const widthCarousel = width - (ApplicationStyles.marginHorizontal.marginHorizontal * 2);

class ImageCommentsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageComments: [],
      indexActive: 0,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { navigation } = nextProps;
    const { imageComments } = navigation.state.params;
    let data = { imageComments };
    return data;
  };

  componentDidMount = () => {
  }

  renderRating = (rating, size) => {
    const htmlRating = [];
    for (let index = 0; index < 5; index++) {
      htmlRating.push(
        <IconIonic
          name="ios-star-half"
          name={index + 0.5 === rating ? 'ios-star-half' : 'ios-star'}
          size={15}
          key={index}
          color={(index + 0.5) <= rating ? Colors.tertiary : Colors.gray2} 
        />
      )
    }

    return (
      <Block flex={false} row>
        {htmlRating}
      </Block>
      );
  };

  handleScrollView = index => {
    this.flatListImage.scrollToIndex({ animated: true, index });
    this.setState({
      indexActive: index
    })
  };

  handleClickImage = () => {
    const { navigation } = this.props;
    navigation.navigate(Screens.IMAGE_ZOOM);
  };

  renderItemCarousel = ({item, index}) => {
    const imageUrl = `${Config.IMAGE_URL}${item}`;
    return (
      <Block flex={false} key={{index}}>
        <TouchableOpacity onPress={() => this.handleClickImage()}>
          <Image 
            source={{ uri: imageUrl }}  
            style={Style.itemCarousel}
          />
        </TouchableOpacity>
      </Block>
    );
  }

  renderItem = (item, index) => {
    const { indexActive } = this.state;
    const imageUrl = `${Config.IMAGE_URL}${item}`;
    return (
      <TouchableOpacity style={indexActive === index ? { borderColor: Colors.green, borderWidth: 1} : null} onPress={() => this.handleClickImageChild(index)}>
        <Image 
          source={{ uri: imageUrl }}  
          style={Style.imageChild}
        />
      </TouchableOpacity>
    );
  }

  handleClickImageChild = index => {
    this.carouselImage.snapToItem (index);
    this.setState({
      indexActive: index
    })
  }

  renderCarousel = () => {
    const { imageComments } = this.state;
    return (
      <Block flex={false} style={{...ApplicationStyles.marginHorizontal}}>
        <Carousel
          data={imageComments}
          renderItem={this.renderItemCarousel}
          sliderWidth={widthCarousel}
          itemWidth={widthCarousel}
          onSnapToItem={index => this.handleScrollView(index)}
          ref={ref => this.carouselImage = ref}
        />
        <FlatList
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          data={imageComments}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item, index}) => this.renderItem(item, index)}
          ref={ref => this.flatListImage = ref }
        />
      </Block>
    );
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
   
    return (
      <Block style={Style.view}>
        <TouchableOpacity style={{marginVertical: 40, marginLeft: 10}} onPress={() => navigation.goBack()}>
          <Text white><Icon name="close" size={25} /></Text>
        </TouchableOpacity>
        <ScrollView>
          {this.renderCarousel()}
        </ScrollView>
      </Block>
    );
  }
}

ImageCommentsScreen.defaultProps = {};

ImageCommentsScreen.propTypes = {};

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImageCommentsScreen);

