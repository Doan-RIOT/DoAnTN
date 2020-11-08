import React, { Component } from 'react'
import Modal from "react-native-modal";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Text, Block } from 'App/Components';
import PropTypes from 'prop-types';
import { strings } from '../Locate/I18n';

class BaseModal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const {
      isOpen,
      title,
      bodyModal,
      footerModal,
      onSave,
      onCancel,
      useScrollView,
      titleStyle,
    } = this.props;

    return (
      <Modal
        isVisible={isOpen}
        onBackdropPress={() => onCancel()}
      >
        <Block flex={false} style={styles.content}>
          {title ? 
            ( <Text h2 center style={titleStyle}>
                {title}
              </Text>
            ) : null
          }
          <Block flex={false} style={styles.body}>
            { useScrollView ? (
              <ScrollView>
                {bodyModal ? bodyModal() : null}
              </ScrollView>
            ) : (
              bodyModal ? bodyModal() : null
            )
            }
          </Block>
          <Block flex={false} style={styles.footer}>
            {footerModal ? (
              footerModal()
            ) : (
              <Block flex={false} bottom>
                {onSave ? (
                  <Button gradient onPress={() => onSave()}>
                    <Text bold white center>
                      {strings('Modal.ok')}
                    </Text>
                  </Button>
                ) : null
                }
                <Button color="danger" onPress={() => onCancel()}>
                  <Text bold white center>
                    {strings('Modal.cancel')}
                  </Text>
                </Button>
              </Block>
            )}
          </Block>
        </Block>
      </Modal>
    )
  }
}

BaseModal.defaultProps = {
  useScrollView: true,
};

BaseModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  title: PropTypes.string,
  bodyModal: PropTypes.func,
  footerModal: PropTypes.func,
  useScrollView: PropTypes.bool,
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    paddingTop: 30,
    padding: 10,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  body: {
    marginTop: 10,
    marginBottom: 10,
    maxHeight: '80%',
    borderColor: 'red'
  },
  footer: {
    marginVertical: 10,
  }
});

export default BaseModal;