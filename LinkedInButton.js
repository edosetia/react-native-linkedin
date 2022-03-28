import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { memo, useCallback } from "react";

function LinkedInButton({
  label = "Sign In With LinkedIn",
  buttonColor = "#017AB6",
  labelStyle = {},
  buttonStyle = {},
  onPress,
}) {
  const onPressSignIn = useCallback(() => onPress());
  return (
    <TouchableOpacity
      style={[s.button, buttonStyle, { backgroundColor: buttonColor }]}
      onPress={onPressSignIn}
    >
      <View
        style={{
          paddingRight: 10,
          borderRightWidth: 0.8,
          borderRightColor: "rgba(255,255,255,.2)",
          height: 35,
          alignItems: "center",
        }}
      >
        <Image
          source={require("./assets/icon.png")}
          style={{
            width: 35,
            height: 35,
          }}
        />
      </View>
      <View style={{ paddingLeft: 10 }}>
        <Text style={[labelStyle, { color: "white" }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  button: {
    paddingHorizontal: 15,
    height: 60,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: buttonColor,
  },
});

LinkedInButton.defaultProps = {
  label: "Sign In With LinkedIn",
  buttonColor: "#017AB6",
};

export default memo(LinkedInButton);
