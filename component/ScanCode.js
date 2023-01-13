import { useState } from "react";
import { RNCamera } from "react-native-camera";

export default function ScanCode() {
    let [detect_code, setDetectCode] = useState("*** not selected ***");
    
    const showDetectCode = (e) => {
        alert(`Barcode value is ${e.data}, type is ${e.type}`);
  
        setDetectCode(e.data);
    }
    
    return (
        <RNCamera 
          ref={ref => {
            this.camera = ref;
          }}
          style={{
            flex: 1,
            width: '100%',
          }}
          
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
  
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio',
            message: 'We need your permission to use your audio for record',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
  
          onBarCodeRead={showDetectCode}>
        </RNCamera>
    )
  }