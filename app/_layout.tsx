import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import './globals.css';

export default function RootLayout() {
  return <>

    {/* keeps the battery percentage and other things hidden */}
    <StatusBar hidden={true}/>

    <Stack>
 
      {/* hides the routes on the top panel of the application */}
      {/* (tabs) folder */}
      <Stack.Screen  
      name="(tabs)"
      options={{headerShown:false}}
      />

      {/* movies folder */}
      <Stack.Screen
      name="movies/[id]"
      options={{headerShown:false}}
      />

    </Stack>
  </>;
}

//the above code inside stack removes the header route shown in the application