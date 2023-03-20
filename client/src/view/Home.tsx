import React from "react";
import {
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { FaWikipediaW } from "react-icons/fa";
import { Link } from "react-router-dom";
const Home: React.FC = () => {
  return (
    <Center h="100vh" bg="white">
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
    </Center>
  );
};

export default Home;
