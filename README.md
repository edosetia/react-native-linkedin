
# react-native-linkedin
React native linkedin  iOS and android.

# Installation
yarn
```bash
yarn add @edose/react-native-linkedin
```

npm
```bash
npm install @edose/react-native-linkedin
```

# Compatibility

 - React Native >= 0.60

# Setup

 - Install Peer Dependency
 yarn
```bash
yarn add react-native-modal react-native-webview query-string
```

npm
```bash
npm install react-native-modal react-native-webview query-string
```

# Usage
```js
...
import SignInLinkedIn from '@edose/react-native-linkedin';
...

render() {
	return (
		<SignInLinkedIn
			isOpen={true}
			clientId={YOUR_LINKEDIN_CLIENT_ID}
			clientSecret={YOUR_LINKEDIN_CLIENT_SECRET}
			redirectUri="https://oauth.pstmn.io/v1/callback"
			state={YOUR_STATE}
			onSuccess={(data) => alert(data)}
		/>
	)
	
}
```

## Available Props
| Name                             | Type                 | Default                        | Description                                                                                                                                |
| -------------------------------- | -------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `clientID`                    | `string`  |                     | LinkedIn Client ID                                                                                                                       |
| `clientSecret`              | `string`             |                            | LinkedIn Client secret                                                      |
| `redirectUri`                   | `string` |              | LinkedIn Redirect URI                                                                                                                      |
| `permissions`             | `array`             | `["r_liteprofile",  "r_emailaddress"]`| Permission                                                                                                |
| `authState`                  | `string`               |                         |                                                                                              |
| `isOpen`                    | `bool`               | `true`                           |                          |
| `onClose`                    | `func`               |   `() => null`                         |                                                                                                                        |
| `onSuccess`                  | `func`             |        `(data) => null`                |                                                                                                               |


