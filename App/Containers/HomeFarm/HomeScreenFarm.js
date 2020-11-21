import React, { Component } from 'react';
import { View, FlatList, Image, TouchableWithoutFeedback, TouchableOpacity, ImageBackground, ScrollView, Animated, TextInput } from 'react-native';
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
  Card, Header, Input, Picker, Loading, TextCurrency
} from "../../Components";
import { Title } from 'react-native-paper';
//drawer
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import {
  getToken, getLanguage,
  resetUser, getUserId,
  getCart, removeStorageItem,
} from '../../Utils/storage.helper';
class HomeScreenFarm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Process: [],
      scrollY: new Animated.Value(0),
      isLoadingFilterProcess: false,
    }
  }
  componentDidMount = async () => {
    //API redux
    const { processActions, process } = this.props
    processActions.fetchProcess();
    this.setState({ Process: process.Process })
    const token = await getToken();
    console.log("tokenHome",token)
  }
  handleOpenFilterProcess = () => {
    this.setState({
      isLoadingFilterProcess: true,
    });
  };

  handleCloseFilterProcess = () => {
    this.setState({
      isLoadingFilterProcess: false,
    });
  };

  renderContentSummaryProcess(item) {
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        style={{ width: "100%" }}
        onPress={() => navigation.navigate(Screens.PROCESS_DETAIL, item)}
      >
        <ImageBackground source={{ uri: item.images[0].url }} style={styles.image} imageStyle={{ borderRadius: 10, resizeMode: "stretch", }} >
          <Block flex={false}>
            <Text h2 color={Colors.white} style={{ paddingBottom: 10 }}>{item.nameProcess}</Text>
            <Block flex={false} style={styles.summaryContent}>
              <Block center flex={false} style={styles.summaryContentItem}>
                <Block flex={false}><Image source={Images.iconLand}></Image></Block>
                <Block row style={{ justifyContent: 'space-between' }}>
                  <Text h3 style={styles.Title_summary}>{strings('HomeFarm.minimalScale')}:</Text>
                  <Text h3 bold style={styles.Title_summary}>{item.minimumScale} {item.standardUnit}</Text>
                </Block>
              </Block>
              <Block flex={false} style={styles.line}></Block>
              <Block center flex={false} style={styles.summaryContentItem}>
                <Block flex={false}><Image source={Images.iconCalendar}></Image></Block>
                <Block row style={{ justifyContent: 'space-between' }}>
                  <Text h3 style={styles.Title_summary}>{strings('HomeFarm.executionTime')}:</Text>
                  <Text h3 bold style={styles.Title_summary}>{item.estimatedTime} {item.estimatedTimeUnit}</Text>
                </Block>
              </Block>
              <Block flex={false} style={styles.line}></Block>
              <Block center flex={false} style={styles.summaryContentItem}>
                <Block flex={false}><Image source={Images.iconSanLuong}></Image></Block>
                <Block row style={{ justifyContent: 'space-between' }}>
                  <Text h3 style={styles.Title_summary}>{strings('HomeFarm.quantity')}:</Text>
                  <Text h3 bold style={styles.Title_summary}>{item.quantity} {item.quantityUnit}</Text>
                </Block>
              </Block>
              <Block flex={false} style={styles.line}></Block>
              <Block center flex={false} style={styles.summaryContentItem}>
                <Block flex={false}><Image source={Images.iconInvest}></Image></Block>
                <Block row style={{ justifyContent: 'space-between' }}>
                  <Text h3 style={styles.Title_summary}>{strings('HomeFarm.investmentCosts')}:</Text>
                  <Block row flex={false} >
                    <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.estimateCost} />
                    <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
                  </Block>
                </Block>
              </Block>
              <Block flex={false} style={styles.line}></Block>
              <Block center flex={false} style={styles.summaryContentItem}>
                <Block flex={false}><Image source={Images.iconMoney}></Image></Block>
                <Block row style={{ justifyContent: 'space-between' }}>
                  <Text h3 style={styles.Title_summary}>{strings('HomeFarm.profit')}:</Text>
                  <Block row flex={false} >
                    <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.sellPrice * item.quantity} />
                    <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
                  </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
  renderProcessFilter = () => {
    return (
      <Block flex={false} style={styles.containBackground} center middle>
        <TouchableWithoutFeedback onPress={() => this.handleCloseFilterProcess()}>
          <Block flex={false} color={Colors.black} style={styles.blackContain} />
        </TouchableWithoutFeedback>
        <Block color={Colors.white} flex={false} style={styles.ProcessFilterContent}>
          <Block middle row flex={false} style={{ padingVertical: 20, justifyContent: 'space-between' }} >
            <TouchableOpacity h2 color={Colors.catalinaBlue}
              onPress={() => this.handleCloseFilterProcess()}
            >
              <Text h2 color={Colors.catalinaBlue}>X</Text>
            </TouchableOpacity>
            <Text h2 bold color={Colors.catalinaBlue}>{strings('HomeFarm.filterprocess')}</Text>
            <TouchableOpacity
              onPress={() => this.handleCloseFilterProcess()}
            >
              <Text h2 color={Colors.catalinaBlue}>{strings('HomeFarm.reset')}</Text>
            </TouchableOpacity>
          </Block>
          <Block style={{ marginTop: 5 }}>
            <ScrollView>
              <Block flex={false} style={{ marginTop: 10 }}>
                <Text h3 bold color={Colors.catalinaBlue}>{strings('HomeFarm.investmentCosts')}</Text>
                <Block row flex={false} style={{ justifyContent: 'space-between', marginTop: 10 }}>
                  <Block style={{ marginRight: 2.5 }}>
                    <Input
                      label={strings('HomeFarm.from')}
                      // error={hasErrors('username')}
                      style={[styles.input]}
                      labelStyle={{ color: Colors.catalinaBlue, fontSize: 18 }}
                      // value={this.state.username}
                      // onChangeText={(text) => this.setState({ username: text })}
                      number
                    />
                  </Block>
                  <Block style={{ marginLeft: 2.5 }} >
                    <Input
                      label={strings('HomeFarm.to')}
                      // error={hasErrors('username')}
                      style={[styles.input]}
                      labelStyle={{ color: Colors.catalinaBlue, fontSize: 18 }}
                      // value={this.state.username}
                      // onChangeText={(text) => this.setState({ username: text })}
                      number
                    />
                  </Block>
                </Block>
                <Block flex={false} style={[styles.line, { marginTop: 10 }]}></Block>
                <Block flex={false} style={{ marginTop: 10, height: 200 }}>
                  <Text h3 bold color={Colors.catalinaBlue}>Tiêu chuẩn</Text>
                  <Block row flex={false} >

                  </Block>
                </Block>
                <Block flex={false} style={[styles.line, { marginTop: 10 }]}></Block>
                <Block flex={false} style={{ marginTop: 10, height: 200 }}>
                  <Text h3 bold color={Colors.catalinaBlue}>Linh vực</Text>
                  <Block row flex={false} >

                  </Block>
                </Block>
                <Block flex={false} style={[styles.line, { marginTop: 10 }]}></Block>
                <Block flex={false} style={{ marginTop: 10, height: 200 }}>
                  <Text h3 bold color={Colors.catalinaBlue}>Thể loại</Text>
                  <Block row flex={false} >

                  </Block>
                </Block>
                <Block flex={false} style={[styles.line, { marginTop: 10 }]}></Block>
                <Block flex={false} style={{ marginTop: 10, height: 200 }}>
                  <Text h3 bold color={Colors.catalinaBlue}>Tên nông sản</Text>
                  <Block row flex={false} >

                  </Block>
                </Block>
              </Block>
            </ScrollView>
          </Block>
          <Block flex={false}>
          </Block>
        </Block>
      </Block>
    );
  };
  render() {
    const data = this.state.Process;
    return (
      <Block center >
        <Header
          title={'Farm'}
        />
        <Block flex={false} style={styles.scrollView}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => (
              this.renderContentSummaryProcess(item)
            )}
          />
        </Block>
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
