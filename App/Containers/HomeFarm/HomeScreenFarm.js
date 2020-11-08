import React, { Component } from 'react';
import { View, FlatList, Image, TouchableOpacity, ImageBackground, ScrollView, Animated, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { strings } from '../../Locate/I18n';
import styles from './HomeScreenFarmStyle';
//redux
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes, { number, string } from 'prop-types';
import ProcessActions from '../../Stores/Process/Actions';
import { Screens } from '../../Utils/screens';
import {
  Button, Block, BaseModal, Cart, Text,
  Card, Header, Input, Picker, Loading
} from "../../Components";
import { Title } from 'react-native-paper';
//drawer
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';

const HEADER_MAX_HEIGHT = 400;
const HEADER_MIN_HEIGHT = 220;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
class HomeScreenFarm extends Component {
  constructor(props) {
    super(props)
    this.state = { Process: [], scrollY: new Animated.Value(0), }
    // console.log(this.props)
  }
  componentDidMount() {
    // //API redux
    // const { processActions, process } = this.props
    // processActions.fetchProcess();
    // //console.log('data process', process.book_array)
    // this.setState({ Process: process.book_array })
    const url = 'https://gist.githubusercontent.com/Doan-RIOT/f5bbefa21f108bcfd99044b979a7ae90/raw/8bb3e9348ca5ad4d6987c7fffcb222838c3d0c70/data.json';
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson.book_array)
        this.setState({ Process: responseJson.book_array })
      })
      .catch((error) => {
        console.error(error);
      })
  }
  renderScrollViewContent() {
    const data = this.state.Process;
    return (
      <Block center>
        {data.map((item) => this.renderContenSummaryProcess(item))}
      </Block>
    );
  }
  renderContenSummaryProcess(item) {
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        style={{ width: "100%" }}
        onPress={() => navigation.navigate(Screens.PROCESS_DETAIL)}
      >
        <ImageBackground source={{ uri: item.image }} style={styles.image} imageStyle={{ borderRadius: 10, resizeMode: "stretch", }} >
          <Block flex={false}>
            <Text h2 color={Colors.white} style={{ paddingBottom: 10 }}>{item.summaryQT.TenQuyTrinh}</Text>
            <Block flex={false} style={styles.summaryContent}>
              <Block center flex={false} style={styles.summaryContentItem}>
                <Block flex={false}><Image source={Images.iconLand}></Image></Block>
                <Block row style={{ justifyContent: 'space-between' }}>
                  <Text h3 style={styles.Title_summary}>{strings('HomeFarm.minimalScale')}:</Text>
                  <Text h3 bold style={styles.Title_summary}>{item.summaryQT.QuyMo}</Text>
                </Block>
              </Block>
              <Block flex={false} style={styles.line}></Block>
              <Block center flex={false} style={styles.summaryContentItem}>
                <Block flex={false}><Image source={Images.iconCalendar}></Image></Block>
                <Block row style={{ justifyContent: 'space-between' }}>
                  <Text h3 style={styles.Title_summary}>{strings('HomeFarm.executionTime')}:</Text>
                  <Text h3 bold style={styles.Title_summary}>{item.summaryQT.thoiGianThucHien} Tháng</Text>
                </Block>
              </Block>
              <Block flex={false} style={styles.line}></Block>
              <Block center flex={false} style={styles.summaryContentItem}>
                <Block flex={false}><Image source={Images.iconSanLuong}></Image></Block>
                <Block row style={{ justifyContent: 'space-between' }}>
                  <Text h3 style={styles.Title_summary}>{strings('HomeFarm.quantity')}:</Text>
                  <Text h3 bold style={styles.Title_summary}>{item.summaryQT.SanLuong}</Text>
                </Block>
              </Block>
              <Block flex={false} style={styles.line}></Block>
              <Block center flex={false} style={styles.summaryContentItem}>
                <Block flex={false}><Image source={Images.iconInvest}></Image></Block>
                <Block row style={{ justifyContent: 'space-between' }}>
                  <Text h3 style={styles.Title_summary}>{strings('HomeFarm.investmentCosts')}:</Text>
                  <Text h3 bold style={styles.Title_summary}>{item.summaryQT.chiPhiDauTu}</Text>
                </Block>
              </Block>
              <Block flex={false} style={styles.line}></Block>
              <Block center flex={false} style={styles.summaryContentItem}>
                <Block flex={false}><Image source={Images.iconMoney}></Image></Block>
                <Block row style={{ justifyContent: 'space-between' }}>
                  <Text h3 style={styles.Title_summary}>{strings('HomeFarm.profit')}:</Text>
                  <Text h3 bold style={styles.Title_summary}>{item.summaryQT.LoiNhuan}</Text>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, 300],
      extrapolate: 'clamp',
    });
    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0],
      extrapolate: 'clamp',
    });
    return (
      <Block center >
        <Animated.View style={[styles.header, { height: headerHeight }, { transform: [{ translateY: imageTranslate }] }]}>
          <Animated.Image
            style={[
              styles.backgroundImage,
              { transform: [{ translateY: imageTranslate }] },
            ]}
            source={Images.imageHeader}
          />
          <Block flex={false} style={styles.bar}>
            <Image source={Images.iconNotifications}></Image>
          </Block>
          <Block flex={false} center middle>
            <Text color={Colors.white} bold h1>Farmate</Text>
            <Text color={Colors.white} h2>Phát triển nhà nông Việt!</Text>
          </Block>
          <Block row flex={false} style={{ height: 50, marginTop: 20, marginHorizontal: 10, justifyContent: 'space-between', }}>
            <Block row center left flex={false} middle style={styles.search}>
              <Icon name="search" size={25} color={Colors.white} style={{ marginLeft: "4%" }} />
              <Block Block flex={false} style={{ marginLeft: 10,width: "80%"}} >
                <TextInput
                  style={{ height: 40, width: "90%"}}
                  // onChangeText={}
                  placeholder='Tìm kiếm quy trình'
                />
              </Block>
            </Block>
            <Block flex={false} center middle>
              <TouchableOpacity>
                <Icon name="filter" size={30} color={Colors.white} style={styles.filter} />
              </TouchableOpacity>
            </Block>
          </Block>
        </Animated.View>
        <ScrollView
          style={styles.scrollView}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
          )}
        >
          {this.renderScrollViewContent()}
        </ScrollView>
      </Block>
    )
  }
}
HomeScreenFarm.propTypes = {};

const mapStateToprop = (state) => ({
  process: state.process.process
})

const mapDispatchToProps = (dispatch) => ({
  processActions: bindActionCreators(ProcessActions, dispatch),
})

export default connect(mapStateToprop, mapDispatchToProps)(HomeScreenFarm);
