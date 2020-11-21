import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import CardsActions from '../../Stores/Card/Actions';
import { Image, Animated, FlatList, RefreshControl, TouchableOpacity, ImageBackground, View, ScrollView } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import Barcode from 'react-native-barcode-builder';
import QRCode from 'react-native-qrcode-svg';
import {
  Block, Text, Header, Loading, TextCurrency, Cart, Radio
} from "../../Components";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Badge } from 'react-native-paper';
import { strings } from '../../Locate/I18n';
import styles from './CardScreenStyle';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';

class CardScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Index: 0,
      refreshing: false,
      card: [1, 2, 3, 4],
      cards: {},
      typeCode: 'barCode',
      Projects: [],
      scrollY: new Animated.Value(0),
    }
  }
  componentDidMount() {
    const url = 'https://gist.githubusercontent.com/Doan-RIOT/f5bbefa21f108bcfd99044b979a7ae90/raw/8bb3e9348ca5ad4d6987c7fffcb222838c3d0c70/data.json';
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson.book_array)
        this.setState({ Projects: responseJson.book_array })
      })
      .catch((error) => {
        console.error(error);
      })
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { errorCode, cards } = nextProps;
    const data = { errorCode, cards };
    return data;
  }

  onRefresh = () => {
    const { cardsActions, userId } = this.props;
    cardsActions.fetchCards(userId);
  };
  renderItemProject(item) {
    const { navigation } = this.props;
    return (
      <TouchableOpacity style={styles.container}
      onPress={() => navigation.navigate(Screens.PROJECT, item)}
      >
        <Image style={styles.image} source={{ uri: item.image }} />
        <Block style={styles.summary}>
          <Text h1 >{item.summaryQT.TenQuyTrinh} </Text>
          <Block row flex={false} style={styles.timePlan}>
            <Block center>
              <Text h3 bold>Bắt đầu</Text>
              <Text h3 bold>12/08/2020</Text>
            </Block>
            <Block center>
              <Text h3 bold>Kết thúc</Text>
              <Text h3 bold>12/08/2020</Text>
            </Block>
          </Block>
          <Block flex={false} style={styles.progress}>
            <Text h3 bold>Tiến độ</Text>
            {this.renderSlidePhase()}
          </Block>
        </Block>
        <Block flex={false} row style={styles.statistical}>
          <Block color={"#B8CEC9"} style={{ marginRight: 2, borderRadius: 5, paddingRight: 5}}>
            <Block center middle flex={false} >
              <Text h3 bold>Dự toán</Text>
            </Block>
            <Block center middle row flex={false} style={{ paddingVertical: 5 }}>
              <Image style={{marginLeft: 5 }} source={Images.invest}></Image>
              <Block center middle row style={{ justifyContent: 'space-between', marginLeft: 10 }}>
                <Text h3>Đầu tư</Text>
                <Text h3>200</Text>
              </Block>
            </Block>
            <Block center middle row flex={false} style={{ paddingVertical: 5 }}>
              <Image style={{marginLeft: 5 }} source={Images.quantity}></Image>
              <Block center middle row style={{ justifyContent: 'space-between', marginLeft: 10 }}>
                <Text h3>Lợi nhuận</Text>
                <Text h3>200</Text>
              </Block>
            </Block>
            <Block center middle row flex={false} style={{ paddingVertical: 5 }}>
              <Image source={Images.profit}></Image>
              <Block center middle row style={{ justifyContent: 'space-between', marginLeft: 10 }}>
                <Text h3>Sản lượng</Text>
                <Text h3>200</Text>
              </Block>
            </Block>
          </Block>
          <Block color={'#FEC868'} style={{ marginRight: 2, borderRadius: 5,paddingRight: 5 }}>
            <Block center middle flex={false} >
              <Text h3 bold>Thực tế</Text>
              <Block center middle row flex={false} style={{ paddingVertical: 5 }}>
              <Image style={{marginLeft: 5 }} source={Images.invest}></Image>
              <Block center middle row style={{ justifyContent: 'space-between', marginLeft: 10 }}>
                <Text h3>Đầu tư</Text>
                <Text h3>200</Text>
              </Block>
            </Block>
            <Block center middle row flex={false} style={{ paddingVertical: 5 }}>
              <Image style={{marginLeft: 5 }} source={Images.quantity}></Image>
              <Block center middle row style={{ justifyContent: 'space-between', marginLeft: 10 }}>
                <Text h3>Sản lượng</Text>
                <Text h3>200</Text>
              </Block>
            </Block>
            <Block center middle row flex={false} style={{ paddingVertical: 5 }}>
              <Image source={Images.profit}></Image>
              <Block center middle row style={{ justifyContent: 'space-between', marginLeft: 10 }}>
                <Text h3>Lợi nhuận</Text>
                <Text h3>200</Text>
              </Block>
            </Block>
            </Block>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
  renderProject() {
    const data = this.state.Projects;
    return (
      <Block center style={{ marginTop: 60 }}>
        {data.map((item) => this.renderItemProject(item))}
      </Block>
    );
  }
  renderSlidePhase = () => {
    const summary = ["Thống kê", "Dự toán", "Điều kiện",];
    const process = ["Giai đoạn 1", "Giai đoạn 2", "Giai đoạn 3", "Giai đoạn 4", "Giai đoạn 5",];
    const summaryProcess = summary.concat(process);
    summaryProcess.push("Kết thúc")
    return (
      <Block flex={false}  >
        <FlatList
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          data={summaryProcess}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => this.renderItemSlidePhase(item, index)}
        ></FlatList>
      </Block>
    )
  }
  renderItemSlidePhase = (item, index) => {
    const { Index } = this.state
    return (
      <TouchableOpacity style={{ marginVertical: 5, marginHorizontal: 5 }}
        onPress={() => this.handleIndexContentProcess(index)}
      >
        <Block flex={false} center middle style={[styles.renderItemSlidePhase, Index === index ? { backgroundColor: "#0A9F9E" } : { backgroundColor: "white" },]} >
          <Text color={Colors.catalinaBlue} bold h3>{item}</Text>
        </Block>
      </TouchableOpacity>
    )
  }
  handleIndexContentProcess = Index => {
    this.setState({
      Index
    });
    console.log(this.state.Index)
  }
  render() {
    const diffClamp = Animated.diffClamp(this.state.scrollY, 0, 45)
    const headerTranslate = diffClamp.interpolate({
      inputRange: [0, 45],
      outputRange: [0, -60],
      extrapolate: 'clamp',
    });
    return (
      <Block style={{}}>
        <ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
          )}>
          {this.renderProject()}
        </ScrollView>
        <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]}  >
          <Header
            title={'Dự án của tôi'}
          >
          </Header>
        </Animated.View>
      </Block>
    );
  }
}

CardScreen.defaultProps = {};

CardScreen.propTypes = {
  cards: PropTypes.object,
  userId: PropTypes.string,
  errorCode: PropTypes.string,
  cardsActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  cards: state.cards.cards,
  userId: state.user.userId,
  errorCode: state.user.errorCode,
})

const mapDispatchToProps = (dispatch) => ({
  cardsActions: bindActionCreators(CardsActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CardScreen);

