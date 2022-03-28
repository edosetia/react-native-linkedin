import React, { Component } from "react";
import { View, StyleSheet, Text, ViewPropTypes } from "react-native";
import Modal from "react-native-modal";
import WebView from "react-native-webview";
import querystring from "query-string";
import PropTypes from "prop-types";

class SignIn extends Component {
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
    isOpen: PropTypes.bool,
  };

  // {"error": "user_cancelled_authorize", "error_description": "The user cancelled the authorization"}
  // {"code": "AQS7z1oSqznU4YoCiw19QIl6Gp-fpNBElOvyJaolHzPiIdxbggvJV9jXcJJxqW6FAYaJ-cieDnQ5iRLtEOxYFdiSsYyVbXq3d2ytO1T-9C3godmXnqr1j3xm9EKQp5KcNxpv9_Ne8pztmTlF4yME7x6lYCIa9Fw0U0fevdXdZxQVM2NsABHcUdnIzST7bYlHFS-IF_ydEuxuncCmzpU"}, "url": "https://oauth.pstmn.io/v1/callback"}
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: true,
      AUTH_URL: "https://www.linkedin.com/uas/oauth2/authorization",
      ACCESS_TOKEN_URL: "https://www.linkedin.com/uas/oauth2/accessToken",
      PROFILE_URL: "https://api.linkedin.com/v2/me",
      EMAIL_URL: "https://api.linkedin.com/v2/emailAddress",
      permissions: props.permissions
        ? props.permissions
        : ["r_basicprofile", "r_emailaddress"],
      clientId: props.clientId,
      clientSecret: props.clientSecret,
      redirectUri: props.redirectUri,
      authState: props.authState,
      authToken: "",
      authAccessToken: "",
      authCode: "",
      raceCondition: false,
      token: "",
      loginScreen: [
        "https://www.linkedin.com/uas/login",
        "https://www.linkedin.com/checkpoint/lg/login-submit",
        "https://www.linkedin.com/checkpoint/rp/request-password-reset",
        "https://www.linkedin.com/checkpoint/rp/password-reset-submit",
      ],
    };
    this.hideModal = this.hideModal.bind(this);
    this.onLoadStart = this.onLoadStart.bind(this);
  }

  componentWillUnmount() {
    this.setState({ modalVisible: false });
  }

  componentDidUpdate(prevProps, nextProps) {}

  getAuthorizationUrl() {
    return `${this.state.AUTH_URL}?${querystring.stringify({
      response_type: "code",
      client_id: this.state.clientId,
      scope: this.state.permissions.join(" ").trim(),
      state: this.state.authState,
      redirect_uri: this.state.redirectUri,
    })}`;
  }

  getPayloadAccessToken(code = this.state.token) {
    return `${this.state.ACCESS_TOKEN_URL}?${querystring.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.state.redirectUri,
      client_id: this.state.clientId,
      client_secret: this.state.clientSecret,
      access_token: this.state.authAccessToken,
    })}`;
  }

  getAccessToken(code) {
    fetch(this.getPayloadAccessToken(code))
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.access_token) {
          this.setState({ authAccessToken: result.access_token }, () =>
            this.getProfile()
          );
        }
      })
      .catch((err) => {});
  }

  getProfilePayload() {
    return `${this.state.PROFILE_URL}?${querystring.stringify({
      oauth2_access_token: this.state.authAccessToken,
      projection:
        "(id,firstName,lastName,profilePicture(displayImage~:playableStreams))",
    })}`;
  }

  getEmailPayload() {
    return `${this.state.EMAIL_URL}?${querystring.stringify({
      oauth2_access_token: this.state.authAccessToken,
      q: "members",
      projection: "(elements*(handle~))",
    })}`;
  }

  getProfile() {
    fetch(this.getProfilePayload())
      .then((response) => {
        return response.json();
      })
      .then((profile) => {
        const localizedFirstName = `${profile.firstName.preferredLocale.language}_${profile.firstName.preferredLocale.country}`;
        let data = {
          id: profile.id,
          firstName: profile.firstName.localized[localizedFirstName],
          lastName: profile.lastName.localized[localizedFirstName],
        };

        if (this.state.permissions.includes("r_emailaddress")) {
          this.getEmail(data);
        } else {
          this.onDone(data);
        }
      });
  }

  getEmail(profile) {
    fetch(this.getEmailPayload())
      .then((response) => {
        return response.json();
      })
      .then((email) => {
        this.props.onSuccess({
          email: email.elements[0][`handle~`].emailAddress,
          profile: profile,
        });
      })
      .catch((err) => {});
  }

  onDone(data) {
    if (this.props.onSuccess instanceof Function) {
      this.props.onSuccess(data);
    }
  }

  getProfileTest() {
    // fetch(
    //   'https://api.linkedin.com/v2/me?access_token=' +
    //     this.state.authAccessToken,
    // )
    //   .then(response => {
    //     return response.json();
    //   })
    //   .then(result => {
    //     if (result.access_token) {
    //     }
    //   });
    // Promise.all([])
  }

  hideModal() {
    // this.setState({modalVisible: false});
    this.props.onClose();
  }
  onLoadStart = async ({ nativeEvent: { url } }) => {
    const { redirectUri, raceCondition } = this.state;

    const queryStringParsed = querystring.parseUrl(url);

    const address = queryStringParsed.url;
    const params = queryStringParsed.query;

    if (address === redirectUri && params.code) {
      this.setState({ authCode: params.code }, () => {
        this.getAccessToken(params.code);
      });
      //successfully authenticated
    }
  };

  render() {
    const { modalVisible } = this.state;
    return (
      <View>
        <Modal
          isVisible={this.props.isOpen}
          style={s.modal}
          animationIn="zoomIn"
          animationOut="zoomOut"
          onDismiss={this.hideModal}
          onBackButtonPress={this.hideModal}
          onBackdropPress={this.hideModal}
        >
          <View style={s.modalWrapper}>
            {/* <View style={s.modalContent}> */}
            {/* <Text style={{color: 'black'}}>Test</Text> */}
            <WebView
              // source={{uri: 'https://google.com'}}
              source={{ uri: this.getAuthorizationUrl() }}
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
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'rgba(0,0,0,0.5)',
    // width: '10%',
  },
  modalWrapper: {
    backgroundColor: "white",
    width: "100%",
    height: "90%",
    borderRadius: 10,
    overflow: "hidden",
  },
  container: {},
  // modalContent: {
  //   backgroundColor: 'white',
  // },
});

SignIn.defaultProps = {
  permissions: ["r_liteprofile", "r_emailaddress"],
};

export default SignIn;
