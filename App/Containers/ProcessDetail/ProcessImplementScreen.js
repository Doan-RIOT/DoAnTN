import React, { Component } from 'react';
import { FlatList, Image, TouchableOpacity, ImageBackground, ScrollView, Animated, } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import {
  Button, Block, BaseModal, Cart,
  Card, Header, Input, Picker, Loading, Text,
} from "../../Components";
import styles from './ProcessImplementScreenStyle';
import { strings } from '../../Locate/I18n';

class ProcessImplementScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollY: new Animated.Value(0),
      isDatePickerVisible: false,
      setDatePickerVisibility: false,
      dateStart: {},
    }
  }
  renderSummaryProcess() {
    const item = { "summaryQT": { "LoiNhuan": "30000000", "QuyMo": "200", "SanLuong": "300", "TenQuyTrinh": "Trồng lúa Organic", "chiPhiDauTu": "100000000", "thoiGianThucHien": "3" } }
    return (
      <Block flex={false} style={styles.summaryContent}>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconLand}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.minimalScale')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.summaryQT.QuyMo}</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconCalendar}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.executionTime')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.summaryQT.thoiGianThucHien} Tháng</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconSanLuong}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.quantity')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.summaryQT.SanLuong}</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconInvest}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.investmentCosts')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.summaryQT.chiPhiDauTu}</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconMoney}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.profit')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.summaryQT.LoiNhuan}</Text>
          </Block>
        </Block>
      </Block>
    );
  }
  render() {
    const {scrollY} = this.state.scrollY
    const { navigation } = this.props;
    const diffClamp = Animated.diffClamp(this.state.scrollY, 0, 45);
    const headerTranslate = diffClamp.interpolate({
      inputRange: [0, 45],
      outputRange: [0, -60],
      extrapolate: 'clamp',
    });
    const showDatePicker = () => {
      this.setState({
        isDatePickerVisible: true
      });
    };
    const hideDatePicker = () => {
      this.setState({
        isDatePickerVisible: false
      });
    };
    const handleConfirm = (date) => {
      console.warn(this.state.scrollY);
      this.setState({dateStart:date})
      hideDatePicker();
    };
    return (
      <Block color={"#F4F4F4"}>
        <ScrollView style={styles.container}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
          )}
        >
          <TouchableOpacity style={styles.buttonImplement}>
            <Block center middle flex={false} style={{ backgroundColor: "#26C165", width: 50, height: 50, borderRadius: 5, marginHorizontal: 10 }} >
              <Image source={Images.iconProcess}></Image>
            </Block>
            <Text h2 bold color={Colors.catalinaBlue}>Trồng lúa Organic</Text>
          </TouchableOpacity>
          <Block flex={false} style={{ marginTop: 20 }}>
            <Text h2 color={Colors.catalinaBlue}>Diện tích canh tác</Text>
            <Input
              style={[styles.input,]}
            />
          </Block>
          <Block flex={false} style={{ marginTop: 20,}}>
            <Text h2 color={Colors.catalinaBlue}>Ngày bắt đầu</Text>
            <Block row center
              style={styles.calendarInput}
            >
              <Text h3>date</Text>
              <TouchableOpacity
                onPress={showDatePicker}
              >
                <Image source={Images.iconCalendar}></Image>
              </TouchableOpacity>
            </Block>

            <DateTimePickerModal
              isVisible={this.state.isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </Block>
          <Block flex={false} style={{ marginTop: 20 }}>
            <Text h2 color={Colors.catalinaBlue}>Địa chỉ</Text>
            <Input
              style={[styles.input,]}
            />
          </Block>
          <Block flex={false} style={styles.location}>

          </Block>
          <Block flex={false} style={{ marginTop: 20 }}>
            <Text h2 color={Colors.catalinaBlue}>Vốn hiện có</Text>
            <Input
              style={[styles.input,]}
            />
          </Block>
          <Block flex={false} style={{ marginTop: 20 }}>
            <Text h2 color={Colors.catalinaBlue}>Yêu cầu hệ thống</Text>
            <Block flex={false} style={styles.requestSystem}>
              <Block flex={false} row center style={styles.itemRequestSystem}>
                <Text h3 color={Colors.catalinaBlue}> Yêu cầu hổ trợ từ chuyên gia</Text>
                <CheckBox />
              </Block>
              <Block flex={false} row center style={styles.itemRequestSystem}>
                <Text h3 color={Colors.catalinaBlue}> Yêu cầu hổ trợ vốn</Text>
                <CheckBox />
              </Block>
              <Block flex={false} row center style={styles.itemRequestSystem}>
                <Text h3 color={Colors.catalinaBlue}> Yêu cầu cung ứng vật tư</Text>
                <CheckBox />
              </Block>
            </Block>
          </Block>
          <Block flex={false} style={{ marginTop: 20 }}>
            <Text h2 color={Colors.catalinaBlue}>Hình ảnh thực địa</Text>
            <Block flex={false} style={{ height: 200 }}>

            </Block>
          </Block>
          <Block flex={false} >
            {this.renderSummaryProcess()}
          </Block>
        </ScrollView>
        <Animated.View style={[styles.header,{ transform: [{ translateY: headerTranslate }] }]}>
          <Header
            isShowBack
            title={'Triên khai quy trình'}
            navigation={navigation}
          />
        </Animated.View>
      </Block>

    )
  }
}
export default ProcessImplementScreen;