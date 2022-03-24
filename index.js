import React, {Component} from 'react';
import {View, StyleSheet, Text, ViewPropTypes} from 'react-native';
import Modal from 'react-native-modal';
import WebView from 'react-native-webview';
import querystring from 'query-string';
import PropTypes from 'prop-types';

class SignInLinkedIn extends Component {
  static propTypes = {
    clientID: PropTypes.string.isRequired,
    clientSecret: PropTypes.string.isRequired,
    redirectUri: PropTypes.string.isRequired,
    permissions: PropTypes.array,
    authState: PropTypes.string,
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    linkText: PropTypes.string,
    renderButton: PropTypes.func,
    renderClose: PropTypes.func,
    containerStyle: ViewPropTypes.style,
    wrapperStyle: ViewPropTypes.style,
    closeStyle: ViewPropTypes.style,
    animationType: Modal.propTypes.animationType,
    isOpen: PropTypes.bool,
  };
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: true,
      AUTH_URL: 'https://www.linkedin.com/uas/oauth2/authorization',
      ACCESS_TOKEN_URL: 'https://www.linkedin.com/uas/oauth2/accessToken',
      permissions: props.permissions
        ? props.permissions
        : ['r_liteprofile', 'r_emailaddress'],
      clientId: props.clientId,
      clientSecret: props.clientSecret,
      redirectUri: props.redirectUri,
      authState: props.authState,
      authToken: '',
      authAccessToken: '',
      raceCondition: false,
      token: '',
    };
    this.hideModal = this.hideModal.bind(this);
    this.onLoadStart = this.onLoadStart.bind(this);
  }

  componentDidMount() {
    // this.getProfile();
  }

  componentWillUnmount() {
    this.setState({modalVisible: false});
  }

  componentDidUpdate(prevProps, nextProps) {
    // console.log(prevProps, nextProps);
    if (nextProps.isOpen) {
      // alert(JSON.string())
      // this.getProfileTest();
    }
  }

  getAuthorizationUrl() {
    return `${this.state.AUTH_URL}?${querystring.stringify({
      response_type: 'code',
      client_id: this.state.clientId,
      scope: this.state.permissions.join(' ').trim(),
      state: this.state.authState,
      redirect_uri: this.state.redirectUri,
    })}`;
  }

  getPayloadAccessToken(code = this.state.token) {
    return `${this.state.ACCESS_TOKEN_URL}?${querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.state.redirectUri,
      client_id: this.state.clientId,
      client_secret: this.state.clientSecret,
      access_token: this.state.authAccessToken,
    })}`;
  }

  getProfile(code) {
    console.log('AUTH ACCESSTOKEN', this.getPayloadAccessToken(code));
    fetch(this.getPayloadAccessToken())
      .then(response => {
        return response.json();
      })
      .then(result => {
        console.log('PROFILE', result);
        if (result.access_token) {
          this.setState({authAccessToken: result.access_token});
        }
      })
      .catch(err => {
        console.log('PROFILE ERR', err);
      });
  }

  getProfileTest() {
    fetch(
      'https://api.linkedin.com/v2/me?access_token=' +
        this.state.authAccessToken,
    )
      .then(response => {
        return response.json();
      })
      .then(result => {
        console.log('PROFILE', result);
      });
  }

  hideModal() {
    // this.setState({modalVisible: false});
    this.props.onClose();
  }
  onLoadStart = async ({nativeEvent: {url}}) => {
    const {redirectUri, raceCondition} = this.state;

    const queryStringParsed = querystring.parseUrl(url);
    const address = queryStringParsed.url;
    const params = queryStringParsed.query;

    if (address === redirectUri && params.code) {
      console.log('CODE', params.code);
      console.log('STATE', params.state);
      this.setState({authAccessToken: params.code}, () => {
        this.getProfile(params.code);
      });
      //successfully authenticated
    }
  };

  render() {
    const {modalVisible} = this.state;
    return (
      <View>
        <Modal
          isVisible={this.props.isOpen}
          style={s.modal}
          animationIn="zoomIn"
          animationOut="zoomOut"
          onDismiss={this.hideModal}
          onBackButtonPress={this.hideModal}
          onBackdropPress={this.hideModal}>
          <View style={s.modalWrapper}>
            {/* <View style={s.modalContent}> */}
            {/* <Text style={{color: 'black'}}>Test</Text> */}
            <WebView
              // source={{uri: 'https://google.com'}}
              source={{uri: this.getAuthorizationUrl()}}
              onLoadStart={this.onLoadStart}
              startInLoadingState
              javaScriptEnabled
              domStorageEnabled

              // injectedJavaScript={injectedJavaScript()}
            />
            {/* </View> */}
          </View>
        </Modal>
      </View>
    );
  }
}

const s = StyleSheet.create({
  modal: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
    // width: '10%',
  },
  modalWrapper: {
    backgroundColor: 'white',
    width: '100%',
    height: '90%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  container: {},
  // modalContent: {
  //   backgroundColor: 'white',
  // },
});

SignInLinkedIn.defaultProps = {
  permissions: ['r_liteprofile', 'r_emailaddress'],
};

export default SignInLinkedIn;

