import React, { Component } from 'react';
import { FlatList, Image, TouchableOpacity, ImageBackground, ScrollView, Animated, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
// import ImagePicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
// import MapView, { Marker } from 'react-native-maps'
import {
  Button, Block, BaseModal, Cart,TextCurrency,
  Card, Header, Input, Picker, Loading, Text,
} from "../../Components";
import styles from './ProcessImplementScreenStyle';
import { strings } from '../../Locate/I18n';
import RNFetchBlob from 'rn-fetch-blob';
import { Config } from '../../Config';
import { getToken } from '../../Utils/storage.helper';

class ProcessImplementScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollY: new Animated.Value(0),
      isDatePickerVisible: false,
      setDatePickerVisibility: false,
      dateStart: '',
      imageData: {},
      isVisible: false,
      startDay: '',
      dataInput:{},
      token: ""
    }
  }
  async componentDidMount() {
    const token = await getToken();
    this.setState({
      token
    })
  }
  handleChange = (value, key) => {
    let { dataInput } = this.state;
    dataInput[key] = value;
    this.setState({
      dataInput,
    })
  }
  handleImplement = () => {
    // console.log(this.state.imageData)
    // console.log(this.state.dataInput)
    const {imageData,dataInput,token}=this.state
    // console.log('token',token)
    // console.log(imageData.fileName, imageData.type)
    RNFetchBlob.fetch('POST', Config.API_URL+"/project/createActualProject", {
      Authorization: "Bearer " + token,
      "Content-Type": "multipart/form-data"
    }, [
      {name: "file", filename: imageData.fileName, type: imageData.type, data: imageData.data },
      {name:"actualScale", data:dataInput.scale},
      {name:"planStartDate", data:dataInput.startDay},
      {name:"address", data:dataInput.address},
    ])
    .then(res => console.log('res',res)).catch(err => console.log(err))
  };
  showDatePicker = () => {
    this.setDatePickerVisibility(true);
  };

  hideDatePicker = () => {
    this.setDatePickerVisibility(false);
  };

  handleConfirm = birthDate => {
    this.hideDatePicker();
    var startDay = birthDate;
    this.setState({
      startDay
    })
  };

  setDatePickerVisibility = isVisible => {
    this.setState({
      isVisible,
    })
  };
  renderSummaryProcess(data) {
    const {dataInput} = this.state
    console.log('1',dataInput.scale)
    var item = {}
    if(dataInput.scale === undefined || dataInput.scale===NaN){
    item = data
    }else{
      var scale =  dataInput.scale / data.minimalScale
      data.minimalScale = scale * data.minimalScale 
      data.estimatedQuantity = scale * data.estimatedQuantity 
      data.estimatedCost = scale * data.estimatedCost 
      item = data
      console.log('2',item)
    }
    return (
      <Block flex={false} style={styles.summaryContent}>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconLand}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.scale')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.minimalScale} {item.standardUnit}</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconCalendar}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.executionTime')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.estimatedTime} {item.estimatedTimeUnit}</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconSanLuong}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.quantity')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.estimatedQuantity} kg</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconInvest}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.investmentCosts')}:</Text>
            <Block row flex={false} >
              <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.estimatedCost} />
              <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
            </Block>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconMoney}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.profit')}:</Text>
            <Block row flex={false} >
              <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.unitPrice * item.estimatedQuantity - item.estimatedCost } />
                <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
              </Block>
          </Block>
        </Block>
      </Block>
    );
  }
  // openCamera = () => {
  //   ImagePicker.openCamera({
  //     forceJpg: true,
  //     mediaType: 'photo',
  //   })
  // }

  // openPicker = () => {
  //   ImagePicker.openPicker({
  //     forceJpg: true,
  //     mediaType: 'photo',
  //   })
  // }

  renderImagePicker = () => {
    const options = {
      title: 'Chọn ảnh',
      cancelButtonTitle: "Thoát",
      takePhotoButtonTitle: "Chụp ảnh",
      chooseFromLibraryButtonTitle: "Chọn ảnh từ thư viện",
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);
      // this.handleChange(response.data, 'image')
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = { };
        this.setState({
          imageData: response,
        });
      }
    });
  }
  render() {
    const { scrollY } = this.state.scrollY
    const { params } = this.props.navigation.state;
    const { navigation } = this.props;
    const diffClamp = Animated.diffClamp(this.state.scrollY, 0, 45);
    const headerTranslate = diffClamp.interpolate({
      inputRange: [0, 45],
      outputRange: [0, -60],
      extrapolate: 'clamp',
    });
    const {isVisible,startDay} = this.state;
    const dateTimePicker = new Date()
    return (
      <Block color={"#F4F4F4"}>
        <ScrollView style={styles.container}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
          )}
        >
          <Block middle style={styles.buttonImplement}>
            <Text h2 bold color={Colors.catalinaBlue}>{params.name}</Text>
          </Block>
          <Block flex={false} style={{ marginTop: 20 }}>
            <Text h2 color={Colors.catalinaBlue}>{strings('Process.cultivatedArea')}</Text>
            <Input
              style={[styles.input,]}
              onChangeText={text => this.handleChange(text, 'scale')}
              number
              rightLabel={
                <Text bold color={Colors.catalinaBlue} style={{marginTop: 20,fontSize:15}}>
                  {params.standardUnit}
                </Text>
              }
            />
          </Block>

          <Block flex={false} style={{ marginTop: 20, }}>
            <TouchableOpacity onPress={() => this.showDatePicker()}>
              <Input
                label={'Thơi gian bắt đầu'}
                value={ startDay !== ''? moment(startDay).format('DD/MM/YYYY'):null} 
                style={styles.input}
                labelStyle ={{fontSize:20,color:Colors.catalinaBlue}}
                onChangeText={text => this.handleChange(text, 'startDay')}
                rightLabel={
                    <Icon
                      name="calendar"
                      style={{position: 'absolute',marginTop: 30}}
                      size={30}
                      onPress={() => this.showDatePicker()}
                    />
                }
                // editable={false}
              />
            </TouchableOpacity>
          </Block>
          <Block flex={false} style={{ marginTop: 20 }}>
            <Text h2 color={Colors.catalinaBlue}>{strings('Process.adress')}</Text>
            <Input
              style={[styles.input,]}
              onChangeText={text => this.handleChange(text, 'address')}
            />
          </Block>
          <Block flex={false} style={{ marginTop: 20 }}>
            <Block row flex={false} style={{ justifyContent: 'space-between' }}>
              <Text h2 color={Colors.catalinaBlue}>{strings('Process.image')}</Text>
              <TouchableOpacity
                onPress={() => this.renderImagePicker()}
              >
                <Image source={Images.iconAwesomeCamera}></Image>
              </TouchableOpacity>
            </Block>
            <Block flex={false} style={{ height: 200, marginVertical: 10, backgroundColor: Colors.white }}>
              <Image style={{ flex: 1 }} source={{ uri: 'data:image/jpeg;base64,' + this.state.imageData.data }} ></Image>
            </Block>
          </Block>
          <Block flex={false} >
            {this.renderSummaryProcess(params)}
          </Block>
        </ScrollView>
        {isVisible && (
          <DateTimePickerModal
            isVisible={isVisible}
            mode="date"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
            date={dateTimePicker}
          />
        )}
        <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]}>
          <Header
            isShowBack
            title={strings('Process.ProcessImplement')}
            navigation={navigation}
          />
        </Animated.View>
        <TouchableOpacity style={styles.buttonImplement1}
        onPress={() => this.handleImplement()}
        >
          <Text h3 bold color={Colors.white}>Triển</Text>
          <Text h3 bold color={Colors.white}>khai</Text>
        </TouchableOpacity>
      </Block>

    )
  }
}
export default ProcessImplementScreen;