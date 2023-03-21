import React, { useEffect, useState } from "react";
import {
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { FaWikipediaW } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { checkAuthentication } from "../utils/checkAuth";
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const checkauth = async () => {
      const isAuthed = await checkAuthentication();
      if (isAuthed) {
        navigate("/project");
      }
      setIsLoading(false);
    };
    checkauth();
  }, []);

  return (
    <Center h="100vh" bg="white">
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
        <VStack>
          <Flex alignItems={"center"}>
            <Icon w={20} h={20} as={FaWikipediaW} />
            <Heading
              marginTop={"6%"}
              marginLeft={"-1%"}
              size="2xl"
              textAlign="center"
              mb={8}
            >
              elcome to WikiAnnotator
            </Heading>
          </Flex>
          <Button colorScheme={"blue"} as={Link} to="/login" size="lg">
            Login
          </Button>
        </VStack>
      )}
    </Center>
  );
};

export default Home;
