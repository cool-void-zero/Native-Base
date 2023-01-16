import { NativeBaseProvider } from "native-base";
import MenuBar from "./component/MenuBar";

export default function App(){
	return (
		<NativeBaseProvider>
			<MenuBar />
		</NativeBaseProvider>
	)
}