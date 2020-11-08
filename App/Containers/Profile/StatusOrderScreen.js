import React, { Component } from 'react';
import { TouchableOpacity, FlatList, RefreshControl, ScrollView } from 'react-native';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
    Button, Block,Text, BaseModal,
    Card, Header, Loading, CheckBox, TextCurrency
  } from "../../Components";
import { Images, Colors } from '../../Theme';
import { strings } from '../../Locate/I18n';
import { Screens } from '../../Utils/screens';
import Style from './StatusOrderScreenStyle';
import { Constants } from '../../Utils/constants';
import UserActions from '../../Stores/User/Actions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';

class StatusOrderScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
          refreshing: false,
        }
      }

    renderItem = item => {
        const { navigation } = this.props.props;
        return (
            <TouchableOpacity
            onPress={() => navigation.navigate(Screens.DETAIL_ORDER, { order : item })}
            >
            <Block style={Style.item}>
                <Text h3 bold>
                {`${strings('ListOrder.Order')}: #${item.id ? item.id : '' }`}
                </Text>
                <Text h3 gray>
                {`${strings('ListOrder.timeOrder')}: `}
                <Text h3 gray>
                    {item.orderDate ? item.orderDate : ''}
                </Text>
                </Text>
                <Text h3 gray>
                {`${strings('ListOrder.statusOrder')}: `}
                <Text h3 color={item.orderStatusId && item.orderStatusId === 'ORDER_CANCELLED' ? Colors.pink2 : Colors.green}>
                    {item.orderStatusString ? item.orderStatusString : ''}
                </Text>
                </Text>
            </Block>
            </TouchableOpacity>
        )
      };

    render() {
        const { statusOrder, refreshing, onRefresh } = this.props;
        return (
            <Block style={Style.view}>
                {statusOrder && statusOrder.length > 0 ? (
                    <Block style={Style.container}>
                    <FlatList
                        vertical
                        scrollEnabled
                        showsVerticalScrollIndicator={false}
                        snapToAlignment="center"
                        data={statusOrder}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={({item}) => this.renderItem(item)}
                        refreshControl={
                        <RefreshControl
                            tintColor={Colors.green5} 
                            colors={[Colors.green6, Colors.green6, Colors.green6]} 
                            progressBackgroundColor={Colors.green5}
                            refreshing={refreshing}
                            onRefresh={() => onRefresh()}
                        />
                        }
                    />
                    </Block>
                ) : (
                    <Block style={Style.containerNotData}>
                        <ScrollView style={{flex:1}}
                            refreshControl={
                            <RefreshControl 
                                tintColor={Colors.green5} 
                                colors={[Colors.green6, Colors.green6, Colors.green6]} 
                                progressBackgroundColor={Colors.green5} 
                                refreshing={refreshing} 
                                onRefresh={()=> onRefresh()} />
                             }> 
                            <Text white>{strings('ListOrder.notHaveOrder')}</Text>
                        </ScrollView>
                        <MaterialIcons name="content-paste" size={70} color={Colors.green} />
                        <Text>{strings('ListOrder.notHaveOrder')}</Text>
                    </Block>
                )}
            </Block>
        );
    }
}

StatusOrderScreen.defaultProps = {};

StatusOrderScreen.propTypes = {
};


export default connect(
    null,
    null,
)(StatusOrderScreen);