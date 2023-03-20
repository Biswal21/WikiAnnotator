import React from "react";
import { Project } from "../types/interfaces";
import {
  Badge,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  LinkBox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { HamburgerIcon } from "@chakra-ui/icons";
import { AiOutlineDelete } from "react-icons/ai";
import axiosInstance from "../utils/axiosAuth";

interface Props {
  project: Project;
  onDelete: (project: Project) => Promise<void>;
}

const ProjectListCard: React.FC<Props> = ({ project, onDelete }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenProject = () => {
    navigate(`/project/${project.id}`);
  };
  return (
    <>
      <LinkBox as={"article"} key={project.id}>
        <Card colorScheme={"red"} variant={"elevated"}>
          <CardHeader>
            <Flex justifyContent={"space-between"}>
              <Heading size={"md"}>{project.name}</Heading>
              <Popover>
                <PopoverTrigger>
                  <HamburgerIcon cursor={"pointer"} />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Project Settings</PopoverHeader>
                  <PopoverBody>
                    <Box cursor={"pointer"} onClick={onOpen}>
                      <HStack>
                        <Icon as={AiOutlineDelete} w={6} h={6} color="red" />
                        <Text fontWeight={"semi-bold"}>Delete Project</Text>
                      </HStack>
                    </Box>
                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Delete Project?</ModalHeader>
                        <ModalCloseButton />
                        <Divider />
                        <ModalBody>Are you sure?</ModalBody>

                        <ModalFooter>
                          <Button
                            colorScheme="red"
                            variant={"solid"}
                            mr={3}
                            onClick={async () => {
                              await onDelete(project);
                              onClose();
                            }}
                          >
                            Delete
                          </Button>
                          <Button
                            onClick={onClose}
                            colorScheme={"gray"}
                            variant="solid"
                          >
                            Cancel
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
          </CardHeader>
          <Box onClick={handleOpenProject} cursor={"pointer"}>
            <Flex justifyContent={"space-between"} p={"1%"}>
              <Box>
                <Text fontWeight={"bold"}>Article Title</Text>
                <Text>{project.article_name}</Text>
              </Box>
              <Box>
                <Text fontWeight={"bold"}>Language</Text>
                <Badge variant={"solid"} colorScheme="cyan">
                  {project.language_id.name}
                </Badge>
              </Box>
              <Box>
                <Text fontWeight={"bold"}>Creator</Text>
                <Tag size={"lg"} variant="subtle" colorScheme={"orange"}>
                  <TagLeftIcon as={FaRegUser} />
                  <TagLabel>{project.created_by.username} </TagLabel>
                </Tag>
              </Box>
              <Box>
                <Text fontWeight={"bold"}>Annotator</Text>
                <Tag size={"lg"} variant="subtle" colorScheme={"purple"}>
                  <TagLeftIcon as={FaRegUser} />
                  <TagLabel>{project.annotated_by.username} </TagLabel>
                </Tag>
              </Box>
              <Box>
                <Text fontWeight={"bold"}>Status</Text>
                <Badge
                  variant={"subtle"}
                  colorScheme={project.is_completed ? "green" : "yellow"}
                >
                  {project.is_completed ? "Completed" : "In Progress"}
                </Badge>
              </Box>
            </Flex>
          </Box>
        </Card>
      </LinkBox>
    </>
  );
};

export default ProjectListCard;
