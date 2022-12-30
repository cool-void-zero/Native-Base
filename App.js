import { NativeBaseProvider, FormControl, Stack, Input, WarningOutlineIcon, Text, Box, Button } from "native-base";
// import { FormControl } from "native-base/lib/typescript/components/composites";

export default function App() {
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <FormControl>
          <Stack mx="4">
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" defaultValue="12345" placeholder="password" />
            <FormControl.HelperText>
              Must be atleast 6 characters.
            </FormControl.HelperText>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Atleast 6 characters are required.
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>
      </Box>
    </NativeBaseProvider>
  )
  
  /*
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Text>Open up App.js to start working on your app!</Text>
        <Button shadow={3} onPress={() => alert("hello world")}>
          Click me
        </Button>
      </Box>
    </NativeBaseProvider>
  )
  */
}
