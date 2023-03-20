import { AddIcon, Icon, SettingsIcon } from "@chakra-ui/icons";
import {
  Text,
  Divider,
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
  Stack,
  useDisclosure,
  VStack,
  LinkOverlay,
  useToast,
  Box,
} from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateProject from "../Components/CreateProject";
import ProjectListCard from "../Components/ProjectListCard";
import { Language, Project, UserData } from "../types/interfaces";
import axiosInstance from "../utils/axiosAuth";
import { checkAuthentication } from "../utils/checkAuth";
import {
  clearTokenLS,
  getAccessTokenLS,
  getRefreshTokenLS,
} from "../utils/localStorage";

const ProjectListView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [language, setLanguage] = useState<Language[]>([]);
  const [annotators, setAnnotators] = useState<UserData[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState<boolean>(false);
  const toast = useToast();
  const toastIdRef = React.useRef<any>();
  useEffect(() => {
    const checkauth = async () => {
      const isAuthed = await checkAuthentication();

      if (!isAuthed) {
        navigate("/login");
      }
    };

    const fetchAnnotator = async () => {
      try {
        const response = await axiosInstance.get<UserData[]>(
          "/user/get/?group=Annotator"
        );
        setAnnotators(response.data);
      } catch (error) {
        console.error("Error fetching annotators:", error);
      }
    };
    const fetchLanguage = async () => {
      try {
        const response = await axiosInstance.get<Language[]>("/language/read/");
        setLanguage(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get<Project[]>("/project/read/");
        console.log("response", response.data);
        setProjects(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setIsLoading(false);
      }
    };
    const checkManager = async () => {
      const group_string = localStorage.group;
      console.log(group_string);
      if (group_string !== "" || group_string !== undefined) {
        const groups = JSON.parse(group_string);
        if (groups.includes("Manager")) {
          setIsManager(true);
        }
      } else {
        setIsManager(false);
        clearTokenLS();
        navigate("/login");
      }
    };

    checkauth();
    checkManager();
    fetchLanguage();
    fetchAnnotator();
    fetchProjects();
  }, []);

  const handleCreateProject = async (data: {
    name: string;
    article_name: string;
    language_id: number;
    annotated_by: number;
  }) => {
    try {
      const response = await axiosInstance.post("/project/create/", data);
      console.log("response", response);
      setProjects([...projects, response.data]);
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleLogOut = async () => {
    const access_token = getAccessTokenLS();
    const refresh_token = getRefreshTokenLS();
    console.log("acccess_token", access_token);
    console.log("refresh_token", refresh_token);
    try {
      const response = await axiosInstance.post("/user/logout/", {
        refresh_token,
        access_token,
      });
      console.log("response", response);
      clearTokenLS();
      toast({
        title: "Logged out successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    }
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      if (project !== null) {
        const response = await axiosInstance.delete(`/project/delete/`, {
          data: { ids: [project.id] },
        });

        if (response.status === 204) {
          const newProjects = projects.filter(
            (projectItem) => projectItem.id !== project.id
          );
          setProjects(newProjects);
          toastIdRef.current = toast({
            title: "Success",
            description: "Project Deleted",
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
    <Flex direction="column" h="100vh">
      <Flex justify="space-between" align="center" p={4}>
        <Heading size="md">MY PROJECTS</Heading>
        <Stack direction="row" spacing={2}>
          {isManager && (
            <IconButton
              aria-label="Create Project"
              icon={<AddIcon />}
              colorScheme="blue"
              variant="solid"
              onClick={onOpen}
            />
          )}
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
                <Box cursor={"pointer"} onClick={handleLogOut}>
                  <HStack>
                    <Icon as={FiLogOut} />
                    <Text>Logout</Text>
                  </HStack>
                </Box>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Stack>
      </Flex>
      <Divider
        orientation="horizontal"
        colorScheme="black"
        variant={"solid"}
        marginEnd={"2%"}
      />
      <VStack align={"stretch"} spacing={4} p={"2%"}>
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
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <ProjectListCard
              key={project.id}
              project={project}
              onDelete={handleDeleteProject}
            />
          ))
        ) : (
          <Flex justifyContent={"center"} alignItems={"center"} h="100%">
            <Heading size="md">No projects found</Heading>
          </Flex>
        )}
      </VStack>
      <CreateProject
        isOpen={isOpen}
        onClose={onClose}
        language={language}
        annotators={annotators}
        onSubmit={handleCreateProject}
      />
    </Flex>
  );
};

export default ProjectListView;
