import { SettingsIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Switch,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Textarea,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../Components/BackButton";
import { DetailedProject, Sentence } from "../types/interfaces";
import axiosInstance from "../utils/axiosAuth";
import { FaRegUser } from "react-icons/fa";
import { Language } from "react-transliterate";
import SentenceCard from "../Components/SentenceCard";
// import "react-transliterate/dist/index.css";

const ProjectView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [projectDetail, setProjectDetail] = useState<DetailedProject | null>(
    null
  );
  const [sentences, setSentences] = useState<Sentence[]>([]);

  const toast = useToast();
  const toastIdRef = React.useRef<any>();

  const { id } = useParams();
  useEffect(() => {
    const fetchProject = async () => {
      console.log(id);
      try {
        const response = await axiosInstance.get<DetailedProject>(
          `/project/${id}/read/`
        );
        console.log("response", response.data);
        setProjectDetail(response.data);
        if (projectDetail) {
          setSentences(projectDetail.sentences);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setIsLoading(false);
        toastIdRef.current = toast({
          title: "Error",
          description: "Something Went Wrong",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    };
    fetchProject();
  }, [id]);

  const handleProjectStatus = async () => {
    try {
      if (projectDetail !== null) {
        setProjectDetail({
          ...projectDetail,
          is_completed: !projectDetail.is_completed,
        });
        const response = await axiosInstance.patch(`/project/update/`, {
          id: projectDetail.id,
          is_completed: !projectDetail.is_completed,
        });
        if (response.status === 200 && response.data.is_completed) {
          toastIdRef.current = toast({
            title: "Success",
            description: "Project Completed",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error("Error updating sentence:", error);
      toastIdRef.current = toast({
        title: "Error",
        description: "Something Went Wrong",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <Flex h="100vh" direction="column">
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
        projectDetail !== null && (
          <>
            <Box
              position={"fixed"}
              w="100%"
              backgroundColor={"gray.100"}
              zIndex={2}
              paddingBottom={"1%"}
            >
              <Flex justify="space-between" align="center" p={4}>
                <HStack spacing={6} direction="row">
                  <BackButton />
                  <Heading size="md"> {projectDetail.name} </Heading>
                </HStack>
                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      aria-label="Profile Settings"
                      icon={<SettingsIcon />}
                      variant="ghost"
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Project Settings</PopoverHeader>
                    <PopoverBody>
                      <Flex justifyContent={"space-between"}>
                        <Text fontWeight={"semi-bold"}>Finish Project</Text>
                        <Switch
                          size="lg"
                          colorScheme={"blue"}
                          isChecked={projectDetail.is_completed}
                          onChange={handleProjectStatus}
                        />
                      </Flex>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
              <Flex
                marginX={"4%"}
                alignItems="center"
                justifyContent={"space-between"}
              >
                <HStack>
                  <Heading size="md">
                    Article: {projectDetail.article_name}
                  </Heading>
                  <Badge marginLeft={"1%"} variant="solid" colorScheme={"cyan"}>
                    {projectDetail.language_id.name}
                  </Badge>
                  <Badge
                    variant={"subtle"}
                    colorScheme={
                      projectDetail.is_completed ? "green" : "yellow"
                    }
                  >
                    {projectDetail.is_completed ? "Completed" : "In Progress"}
                  </Badge>
                </HStack>
                <HStack>
                  <Tooltip label="Creator" aria-label="a tooltip">
                    <Tag size={"lg"} variant="subtle" colorScheme={"orange"}>
                      <TagLeftIcon as={FaRegUser} />
                      <TagLabel>{projectDetail.created_by.username} </TagLabel>
                    </Tag>
                  </Tooltip>
                  <Tooltip label="Annotator" aria-label="a tooltip">
                    <Tag size={"lg"} variant="subtle" colorScheme={"purple"}>
                      <TagLeftIcon as={FaRegUser} />
                      <TagLabel>
                        {projectDetail.annotated_by.username}{" "}
                      </TagLabel>
                    </Tag>
                  </Tooltip>
                </HStack>
              </Flex>
            </Box>
            {projectDetail.sentences.length > 0 ? (
              <Flex w={"100%"} direction="column" marginTop={"8%"}>
                {projectDetail.sentences.map((sentence) => (
                  <SentenceCard
                    key={sentence.id}
                    sentence={sentence}
                    lang_code={projectDetail.language_id.language_code}
                  />
                ))}
              </Flex>
            ) : (
              <></>
            )}
          </>
        )
      )}
    </Flex>
  );
};

export default ProjectView;
