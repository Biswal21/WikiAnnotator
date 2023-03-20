import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axiosInstance from "../utils/axiosAuth";
import { useNavigate } from "react-router-dom";
import { setTokenLS } from "../utils/localStorage";
import { checkAuthentication } from "../utils/checkAuth";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkauth = async () => {
      const isAuthed = await checkAuthentication();
      if (isAuthed) {
        navigate("/project");
        setIsLoading(false);
      }
    };

    checkauth();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      setError("All fields are required");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/user/login/", {
        username,
        password,
      });
      console.log("response", response.data);
      setTokenLS(response.data);
      setIsLoading(false);
      navigate("/project");
      toast({
        title: "Logged in successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // TODO: Redirect to the next page
    } catch (error) {
      console.error("Error logging in:", error);
      setIsLoading(false);
      toast({
        title: "Failed to log in.",
        description: "Something went wrong. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      {isLoading ? (
        <Flex justifyContent={"center"} alignItems={"center"} h="100%">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      ) : (
        <Card maxW="md" mx="auto">
          <Box p={4}>
            <Heading size="lg" mb={4}>
              Login
            </Heading>
            <form onSubmit={handleLogin}>
              <FormControl id="username" mb={4}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
              <Stack direction="row" spacing={4} justifyContent="flex-end">
                <Button
                  variant={"solid"}
                  colorScheme={"blue"}
                  isLoading={isLoading}
                  type="submit"
                >
                  Login
                </Button>
              </Stack>
            </form>
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default Login;
