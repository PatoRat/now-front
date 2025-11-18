import React, { useRef, useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import { Router } from "expo-router";
import { useTheme } from "@/src/components/context-provider/Theme";
import DATA from "@/assets/databases/data";
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import PostFormContent, { stylesFn } from "./PostFormContent";



const PostInputsHandler = (props: { router: Router }) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const styles = stylesFn(theme, width);
  const mapRef = useRef<MapView | null>(null);

  

  return (
      <View style={styles.card}>
        <PostFormContent
          theme={theme}
          styles={styles}
          router={props.router}
        />
      </View>
  );
};

export default PostInputsHandler;
