# react-native-linkedin

React native linkedin iOS and android.

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

#### Example

```js
import React, { useState } from 'react';
import { SignIn, LinkedInButton } from '@edose/react-native-linkedin';

function Example() {
	const [open, setOpen] = useState(false)
	return (
		<LinkedInButton
			label="Sign In With LinkedIn"
			labelStyle={{//custom style}}
			buttonColor="#017AB6"
			onPress={() => setOpen(true)}
		/>
		<SignIn
			isOpen={true}
			clientId={YOUR_LINKEDIN_CLIENT_ID}
			clientSecret={YOUR_LINKEDIN_CLIENT_SECRET}
			redirectUri="https://oauth.pstmn.io/v1/callback"
			state={YOUR_STATE}
			onSuccess={(data) => alert(data)}
			onCancel={() => setOpen(false)
		/>
	)
}
```

## Available Props

- **SignIn**

| Name           | Type     | Default                               | Description            |
| -------------- | -------- | ------------------------------------- | ---------------------- |
| `clientID`     | `string` |                                       | LinkedIn Client ID     |
| `clientSecret` | `string` |                                       | LinkedIn Client secret |
| `redirectUri`  | `string` |                                       | LinkedIn Redirect URI  |
| `permissions`  | `array`  | `["r_liteprofile", "r_emailaddress"]` | Permission             |
| `authState`    | `string` |                                       |                        |
| `isOpen`       | `bool`   | `true`                                |                        |
| `onClose`      | `func`   | `() => null`                          |                        |
| `onSuccess`    | `func`   | `(data) => null`                      |                        |

- **LinkedInButton**

| Name          | Type        | Default                  | Description  |
| ------------- | ----------- | ------------------------ | ------------ |
| `label`       | `string`    | `Sign In With LinkedIn ` | Button label |
| `buttonColor` | `string`    | `#017AB6`                | Button color |
| `labelStyle`  | `ViewStyle` | `{}`                     |              |
| `buttonStyle` | `ViewStyle` | `{}`                     |              |
| `onPress`     | `func`      | `() => null`             |
