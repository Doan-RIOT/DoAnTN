import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes, { string } from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Image, TouchableOpacity, ScrollView, Platform, ImageBackground,Dimensions } from 'react-native';
import RNRestart from 'react-native-restart';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { PERMISSIONS, requestMultiple, checkMultiple } from 'react-native-permissions';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import {
  Button, Block, Text, BaseModal,
  Card, Header, Loading, CheckBox, TextCurrency, Input, Radio
} from "../../Components";
import UserActions from '../../Stores/User/Actions';
import CartActions from '../../Stores/Cart/Actions';
import { userService } from '../../Services/UserService';
import { strings } from '../../Locate/I18n';
import Style from './AddTaskScreenStyle';
import { Images, Colors } from '../../Theme';
import { resetUser, getCart,getToken } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import { LoginManager } from 'react-native-fbsdk';
import { cardsService } from '../../Services/CardsService';
import ProcessActions from '../../Stores/Process/Actions';
const { width } = Dimensions.get('window');
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
class MaterialDetailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      isOpen: false,
      errorCode: '',
      isVisible: false,
      errors: [],
      msgError: '',
      dataUpdate: {},
      idProcess:''
    }
  }
  componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log('idProcess',params.idProcess)
    this.setState({
        dataUpdate:params.item,
        idProcess:params.idProcess
    })
  }
  handleSave = async () => {
    const token = await getToken();
    const {dataUpdate,idProcess} = this.state;
    const {navigation,processActions } = this.props;
    console.log('idProcess',idProcess)
    if(dataUpdate){
        var data = { 
        name: dataUpdate.name, 
        _id: dataUpdate._id,
        actualQuantity: dataUpdate.actualQuantity,
        actualUnitPrice: dataUpdate.actualUnitPrice,
        }
    }
    if(token){
        try {
          cardsService.updateMaterial(data,token)
              .then(response => {
                if (response) {
                  console.log('update done')
                  processActions.fetchProcessDetail(idProcess);
                } else {
                  console.log('err1')
                }
              });
        } catch (error) {
          console.log('err2')
        }
      }
  }
  handleChange = (value, key) => {
    let { dataUpdate} = this.state;
    dataUpdate[key] = value;
    this.setState({
        dataUpdate,
    })
  }
  render() {
    const {errorCode, errors, msgError,dataUpdate} = this.state;
    const { navigation } = this.props;
    const hasErrors = (key) => (errors.includes(key) ? Style.hasErrors : null)
    return (
      <Block>
        <Header
          isShowBack
          title={strings("Project.editMaterial")}
          navigation={navigation}
        >
        </Header>
        <ScrollView>
          <Block flex={false} style={Style.container}>
            <Text error>{msgError}</Text>
            <Input
              label={strings("Project.nameMaterial")}
              labelStyle ={{fontSize:20,color:Colors.green}}
              error={hasErrors('firstName')}
              style={[Style.input, hasErrors('firstName')]}
              value={dataUpdate && dataUpdate.name ? dataUpdate.name : ''}
              onChangeText={text => this.handleChange(text, 'name')}
            />
            <Input
              editable={false}
              label={strings('Project.quantityMaterial')}
              labelStyle ={{fontSize:20,color:Colors.green}}
              error={hasErrors('email')}
              style={Style.input}
              value={dataUpdate && dataUpdate.quantity ? dataUpdate.quantity.toString() : ''}
              onChangeText={text => this.handleChange(text, 'quantity')}
              rightLabel={
                <Text h3 color={Colors.catalinaBlue} style={{marginTop:35,position: 'absolute',}}>{dataUpdate.unit}</Text>
              }
            />
            <Input
              editable={false}
              label={strings('Project.unitPriceMaterial')}
              labelStyle ={{fontSize:20,color:Colors.green}}
              error={hasErrors('email')}
              style={Style.input}
              number
              value={dataUpdate && dataUpdate.unitPrice ? dataUpdate.unitPrice.toString() : ''}
              onChangeText={text => this.handleChange(text, 'unitPrice')}
              rightLabel={
                <Text h3 color={Colors.catalinaBlue} style={{marginTop:35,position: 'absolute',}}>vnđ</Text>
              }
            />
            <Input
              label={strings('Project.actualQuantityMaterial')}
              labelStyle ={{fontSize:20,color:Colors.green}}
              error={hasErrors('phone')}
              style={[Style.input, hasErrors('phone')]}
              value={dataUpdate && dataUpdate.actualQuantity ? dataUpdate.actualQuantity.toString() : ''}
              number
              onChangeText={text => this.handleChange(parseInt(text), 'actualQuantity')}
              rightLabel={
                <Text h3 color={Colors.catalinaBlue} style={{marginTop:35,position: 'absolute',}}>{dataUpdate.unit}</Text>
              }
            />
            <Input
              label={strings('Project.actualPriceMaterial')}
              labelStyle ={{fontSize:20,color:Colors.green}}
              error={hasErrors('phone')}
              style={[Style.input, hasErrors('phone')]}
              value={dataUpdate && dataUpdate.actualUnitPrice ? dataUpdate.actualUnitPrice.toString() : ''}
              number
              onChangeText={text => this.handleChange(parseInt(text), 'actualUnitPrice')}
              rightLabel={
                <Text h3 color={Colors.catalinaBlue} style={{marginTop:35,position: 'absolute',}}>vnđ</Text>
              }
            />
            <Block flex={false} center style={{ paddingTop: 20 }}>
              <Button
                green
                onPress={() => this.handleSave()}
                style={Style.button}
              >
                <Text bold white center style={{ padding: 10 }}>
                  {strings('UserInfo.save')}
                </Text>
              </Button>
            </Block>
          </Block>
        <Toast
          ref="toastSuccess"
          style={{ backgroundColor: Colors.green }}
          position='top'
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
        <Toast
          ref="toastFailed"
          style={{ backgroundColor: Colors.accent }}
          position='top'
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
        </ScrollView>
      </Block>
    )
  }
}
const mapStateToprop = (state) => ({
    processDetail: state.process.processDetail
  })
  
  const mapDispatchToProps = (dispatch) => ({
    processActions: bindActionCreators(ProcessActions, dispatch),
  })
  export default connect(mapStateToprop, mapDispatchToProps)(MaterialDetailScreen);