import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import CardsActions from '../../Stores/Card/Actions';
import { Image, FlatList, RefreshControl } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import Barcode from 'react-native-barcode-builder';
import QRCode from 'react-native-qrcode-svg';
import {
  Block, Text, Header, Loading, TextCurrency, Cart, Radio
} from "../../Components";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Badge } from 'react-native-paper';
import { strings } from '../../Locate/I18n';
import Style from './CardScreenStyle';
import { Sizes, Colors } from '../../Theme';
import { resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';

class CardScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      card: [1, 2, 3, 4],
      cards: {},
      typeCode: 'barCode',
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, cards } = nextProps;
    const data = { errorCode, cards };
    return data;
  }

  onRefresh = () => {
    const { cardsActions, userId } = this.props;
    cardsActions.fetchCards(userId);
  };

  renderItem = item => {
    const imageUrl = `${Config.IMAGE_URL}?uploadId=${item.uploadId}&seq=1`;
    return (
      <Block style={{marginVertical: 5}}>
        <Image 
          source={{uri: imageUrl}}  
          style={Style.card}
        />
      </Block>
    )
  };

  renderContent = () => {
    const { cards, typeCode, refreshing } = this.state;
    const { userId } = this.props;
    const card = cards.card ? cards.card : [];
    const nowPoints = cards.nowPoints ? cards.nowPoints : 0
    return (
      <>
      <Block flex={false} style={Style.container}>
        <Block flex={false} row>
          <Radio
            label={strings('Card.barCode')}
            value="barCode"
            color={Colors.pink2}
            uncheckedColor={Colors.green}
            checked={typeCode === 'barCode'}
            onPress={value => this.setState({
              typeCode: value
            })}
            style={{ width : 100 }}
          />
          <Radio
            label={strings('Card.qrCode')}
            value="qrCode"
            color={Colors.pink2}
            uncheckedColor={Colors.green}
            checked={typeCode === 'qrCode'}
            onPress={value => this.setState({
              typeCode: value
            })}
          />
        </Block>
        <Block flex={false} center style={{ padding: 10 }}>
          {typeCode === 'qrCode' ? (
            <QRCode
              value={userId}
              size={130}
            />
          ) : (
            <Barcode value={userId} format="CODE128" />
          )}
        </Block>
      </Block>
      {nowPoints && nowPoints !== null ? (
        <Block flex={false} style={Style.container}>
          <Text h3>{strings('Card.titlePoints')}</Text>
          <Text h3><TextCurrency value={nowPoints ? nowPoints : 0} style={Style.points} /> {strings('Card.points')}</Text>
        </Block>
      ) : null}
        <Block style={[Style.container, { padding: 5, marginBottom: 10}]}>
          <FlatList
            vertical
            scrollEnabled
            showsVerticalScrollIndicator={false}
            snapToAlignment="center"
            data={card}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({item}) => this.renderItem(item)}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={refreshing}
                onRefresh={() => this.onRefresh()}
              />
            }
          />
        {card && card.length === 0 ? (
          <></>
        ) : null}
        </Block>
      </>
    )
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

    const { navigation, userId } = this.props;
    return (
      <Block style={Style.view}>
        <Header 
          title={strings('Card.card')}
          rightIcon={<Cart navigation={navigation} />}
        />
        { userId && userId !== '' ? (
          this.renderContent()
        ) : null}
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

