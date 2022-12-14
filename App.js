import React, {useEffect, useState} from 'react';
import MapView, {Callout} from 'react-native-maps';
import {StyleSheet, View, Text, TextInput, ToastAndroid, Button} from 'react-native';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import {getDistance} from "geolib";


export default function App() {

  const [errorMsg, setErrorMsg] = useState({});

  const[isCalloutVisibleForMarker1,setIsCalloutVisibleForMarker1] = useState(false);
  const[isCalloutVisibleForMarker2,setIsCalloutVisibleForMarker2] = useState(false);
  const[isCalloutVisibleForMarker3,setIsCalloutVisibleForMarker3] = useState(false);

  const[isMarkerOneVisible,setIsMarkerOneVisible] = useState(true)
  const[isMarkerTwoVisible,setIsMarkerTwoVisible] = useState(true)
  const[isMarkerThreeVisible,setIsMarkerThreeVisible] = useState(true)

  const[isWinningButtonVisible, setIsWinningButtonVisible] = useState(true)

  const markers = [
      { latitude : 49.813640  , longitude : 19.086291 , question: "Pytanie 1"}
    , { latitude : 49.802529  , longitude : 19.050687, question: "Pytanie 2"}
    , { latitude: 49.898634  , longitude: 18.994518, question: "Pytanie 3"}
    ]

  const initialRegion={
    longitudeDelta: 80,
    latitudeDelta: 80,
    latitude: 40,
    longitude: 10
  }


  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,

          }, (newLocation) => {
            newLocation.coords.latitude = markers[2].latitude;
            newLocation.coords.longitude = markers[2].longitude;


            let distanceFromMarker1 = getDistance({latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude },
                {latitude: markers[0].latitude, longitude: markers[0].longitude}
                );

            let distanceFromMarker2 = getDistance({latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude },
                {latitude: markers[1].latitude, longitude: markers[1].longitude}
            );

            let distanceFromMarker3 = getDistance({latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude },
                {latitude: markers[2].latitude, longitude: markers[2].longitude}
            );

            if(distanceFromMarker1 < 200) {
              setIsCalloutVisibleForMarker1(true)
            }

            if(distanceFromMarker2 < 200) {
              setIsCalloutVisibleForMarker2(true)
            }

            if(distanceFromMarker3 < 200) {
              setIsCalloutVisibleForMarker3(true)
            }
          }
      );



    })();
  }, []);

  const verifyUserAnswer = (text) => {

    if(isCalloutVisibleForMarker1 && text ==="Odpowiedz 1") {
      setIsMarkerOneVisible(false);
      setIsCalloutVisibleForMarker1(false);
    }

    if(isCalloutVisibleForMarker2 && text ==="Odpowiedz 2") {
      setIsMarkerTwoVisible(false);
      setIsCalloutVisibleForMarker2(false);
    }

    if(isCalloutVisibleForMarker3 && text ==="Odpowiedz 3") {
      setIsMarkerThreeVisible(false);
      setIsCalloutVisibleForMarker3(false);
    }
  }



  const showToastWithGravity = () => {

    ToastAndroid.showWithGravity(
        "Gratulację, zwyciężyłeś!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
    )

    setIsWinningButtonVisible(false)

  }



  return (
      <View style={styles.container}>



        <MapView style={styles.map} showsUserLocation={true} region={initialRegion}>

          { isMarkerOneVisible ? <Marker coordinate={{latitude: 49.813640, longitude: 19.086291}}>
            {isCalloutVisibleForMarker1 ?  <Callout>
              <Text>Pytanie 1</Text>
            </Callout>: "" }
          </Marker> : "" }

          { isMarkerTwoVisible ? <Marker coordinate={{latitude: 49.802529, longitude: 19.050687}}>
            {isCalloutVisibleForMarker2 ?  <Callout>
              <Text>Pytanie 2</Text>
            </Callout>: "" }
          </Marker> : "" }

          { isMarkerThreeVisible ? <Marker coordinate={{latitude: 49.898634, longitude: 18.994518}}>
            {isCalloutVisibleForMarker3 ?  <Callout>
              <Text>Pytanie 3</Text>
            </Callout>: "" }
          </Marker> : "" }


        </MapView>

        {isCalloutVisibleForMarker1 && isMarkerOneVisible ? <View>
            <TextInput style={styles.inputAnswer} placeholder={"Podaj odpowiedz na pierwsze pytanie"} onChangeText={verifyUserAnswer}></TextInput>
        </View> : "" }

        {isCalloutVisibleForMarker2 && isMarkerTwoVisible ? <View>
          <TextInput style={styles.inputAnswer} placeholder={"Podaj odpowiedz na drugie pytanie"} onChangeText={verifyUserAnswer}></TextInput>
        </View> : "" }

        {isCalloutVisibleForMarker3 && isMarkerThreeVisible ? <View>
          <TextInput style={styles.inputAnswer} placeholder={"Podaj odpowiedz na trzecie pytanie"} onChangeText={verifyUserAnswer}></TextInput>
        </View> : "" }

        {isWinningButtonVisible && !isMarkerOneVisible && !isMarkerTwoVisible && !isMarkerThreeVisible ?<Button
            title="Kliknij przycisk aby wygrać"
            onPress={() => showToastWithGravity()}/> : ""}



      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8
  },
  map: {
    width: '100%',
    height: '100%',
  },
  inputAnswer:{
    position:"absolute",
    width: "90%",
    bottom:90,
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    backgroundColor: "white"
  }
});