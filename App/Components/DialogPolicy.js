import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Modal,
} from "react-native";
// import CheckBox from 'react-native-check-box';
import { CheckBox } from 'react-native-elements';
import { Colors, ResponsiveUtils, Constants} from "@common";
import Text from './Text';
import { Screens } from '../Utils/screens';

export default class DialogPolicy extends React.PureComponent {
  state = {
    checked: false
  }

  _onChecked = () => {
    this.setState({checked: !this.state.checked});
  }

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.props.visible}
        onShow={() => {
          this.setState({checked: false});
        }}>
        <View style={styles.container}>
          <View style={styles.panel}>
            <View style={styles.containerTitle}>
              <Text style={styles.titleDialog}>{__.t("Notify me more")}</Text>
            </View>
            <View style={styles.line}/>
            <View style={styles.containerTextTerms}>
              <View style={styles.underLine}>
                <Text style={styles.termService}>•{__.t("Terms of service")}</Text>
              </View>
            </View>
            <View style={styles.containerTextPrivacy}>
              <View style={styles.underLine}>
                <Text style={styles.termService}>•{__.t("Privacy statement")}</Text>
              </View>
            </View>
            {/* <CheckBox
              style={{flex: 1, padding: 10}}
              onClick={this._onChecked}
              isChecked={this.state.checked}
              rightText="위의 각 항목에 동의합니다"
            /> */}
            <CheckBox
              title={__.t("I agree with each item above")}
              textStyle={{fontWeight: 'bold'}}
              containerStyle={styles.checkbox}
              checkedColor={Colors.backgroundColor}
              onPress={this._onChecked}
              checked={this.state.checked}
            />
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <TouchableHighlight style={styles.btnCancel} underlayColor={Colors.appColor} onPress={this.onCancel}>
                <Text style={styles.textButton}>{__.t("Cancel")}</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.btnAgree} underlayColor={Colors.appColor} onPress={this.onAgree}>
                <Text style={styles.textButton}>{__.t("Agree")}</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  onCancel = () => {
    this.props.onClosed();
  }

  onAgree = () => {
    if(this.state.checked) {
      this.props.onClosed();
      this.props.navigation.navigate(Screens.SIGNUP);
    }
    else {
      alert(__.t("You must agree to the policies and terms"));
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D3D3DDF'
  },
  panel: {
    width: '90%',
    overflow: 'hidden',
    backgroundColor: 'white',
    margin: ResponsiveUtils.normalize(20),
    borderRadius: ResponsiveUtils.normalize(20)
  },
  containerTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: ResponsiveUtils.normalize(15)
  },
  titleDialog: {
    fontSize: ResponsiveUtils.normalize(25),
    fontWeight: 'bold'
  },
  line: {
    height: 2,
    backgroundColor: Colors.backgroundColor
  },
  containerTextTerms: {
    flexDirection: 'row',
    margin: ResponsiveUtils.normalize(20)
  },
  underLine: {
    borderBottomWidth: 2,
    borderColor: Colors.appColor,
    paddingBottom: 3
  },
  containerTextPrivacy: {
    flexDirection: 'row',
    marginLeft: ResponsiveUtils.normalize(20),
    marginBottom: ResponsiveUtils.normalize(20),
  },
  privacy: {
    margin: ResponsiveUtils.normalize(20),
    marginTop: 0
  },
  btnCancel: {
    flex: 1,
    padding: ResponsiveUtils.normalize(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.borderColor,
  },
  btnAgree: {
    flex: 1,
    padding: ResponsiveUtils.normalize(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: Colors.borderColor,
  },
  textButton: {
    fontSize: ResponsiveUtils.normalize(20)
  },
  checkbox: {
    padding: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'white'
  },
})