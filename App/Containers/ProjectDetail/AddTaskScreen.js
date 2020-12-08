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
import { resetUser, getCart } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import { LoginManager } from 'react-native-fbsdk';
const { width } = Dimensions.get('window');
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
class AddTaskScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      isOpen: false,
      errorCode: '',
      isVisible: false,
      errors: [],
      msgError: '',
      newTask: {},
    }
  }
  handleSave = () => {
    const {newTask} = this.state;
    const { language, userActions, navigation } = this.props;
    let errors = [];
    let msgError = '';
    if (newTask.name === '' || newTask.name  === null) {
      errors.push('firstName');
      msgError = strings('Project.msgErrorRequiredName');
    } else if (newTask.description === '' || newTask.description === null) {
      errors.push('phone');
      msgError = strings('Project.msgErrorRequiredDescription');
    }
    this.setState({
      msgError,
      errors
    })
    if (errors.length === 0) {
      // try {
      //   userService.updateProfile(profile, language)
      //   userActions.fetchProfile()
      //   navigation.navigate(Screens.PROFILE);
      // } catch (error) {
      //   this.refs.toastFailed.show(strings('UserInfo.msgUpdateProfileFailed'), DURATION.LENGTH_LONG);
      // }
      
    console.log('newTask',newTask)
    }
  }
  handleChange = (value, key) => {
    let { newTask } = this.state;
    newTask[key] = value;
    this.setState({
      newTask,
    })
  }
  render() {
    const {errorCode, errors, msgError,newTask} = this.state;
    const { navigation } = this.props;
    const hasErrors = (key) => (errors.includes(key) ? Style.hasErrors : null)
    return (
      <Block>
        <Header
          isShowBack
          title={strings("Project.addTask")}
          navigation={navigation}
        >
        </Header>
        <ScrollView>
          <Block flex={false} style={Style.container}>
            <Text error>{msgError}</Text>
            <Input
              label={strings("Project.nameTask")}
              error={hasErrors('firstName')}
              style={[Style.input, hasErrors('firstName')]}
              value={newTask && newTask.name ? newTask.name : ''}
              onChangeText={text => this.handleChange(text, 'name')}
            />
            <Input
              label={strings('Project.description')}
              error={hasErrors('email')}
              style={Style.input}
              value={newTask && newTask.description ? newTask.description : ''}
              onChangeText={text => this.handleChange(text, 'description')}
            />
            <Input
              label={strings('Project.estimatedTime')}
              error={hasErrors('email')}
              style={Style.input}
              value={newTask && newTask.estimatedTime ? newTask.estimatedTime : ''}
              onChangeText={text => this.handleChange(text, 'estimatedTime')}
            />
            <Input
              label={strings('Project.workerNum')}
              error={hasErrors('phone')}
              style={[Style.input, hasErrors('phone')]}
              value={newTask && newTask.workerNum ? newTask.workerNum : ''}
              number
              onChangeText={text => this.handleChange(text, 'workerNum')}
            />
            <Input
              label={strings('Project.workerUnitFee')}
              error={hasErrors('phone')}
              style={[Style.input, hasErrors('phone')]}
              value={newTask && newTask.workerUnitFee ? newTask.workerUnitFee : ''}
              number
              onChangeText={text => this.handleChange(text, 'workerUnitFee')}
            />
            <Block row>
              <Block flex={false} style={{ width: '30%' }}>
                <Radio
                  label={strings('Project.dailyTask')}
                  value="0"
                  color={Colors.pink2}
                  styleTitle={Style.radio}
                  uncheckedColor={Colors.green}
                  checked={newTask && newTask.isDailyTask && newTask.isDailyTask === "0"}
                  onPress={value => this.handleChange(value, 'isDailyTask')}
                />
              </Block>
              <Block flex={false}>
                <Radio
                  label={strings('Project.task')}
                  value="1"
                  color={Colors.pink2}
                  styleTitle={Style.radio}
                  uncheckedColor={Colors.green}
                  checked={newTask && newTask.isDailyTask && newTask.isDailyTask === "1"}
                  onPress={value => this.handleChange(value, 'isDailyTask')}
                />
              </Block>
            </Block>
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
        </ScrollView>
      </Block>
    )
  }
}
export default AddTaskScreen;