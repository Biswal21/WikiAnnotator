import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Divider,
  FormErrorMessage,
  FormControl,
  Select,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Language, UserData } from "../types/interfaces";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language[];
  annotators: UserData[];
  onSubmit: (data: {
    name: string;
    article_name: string;
    language_id: number;
    annotated_by: number;
  }) => Promise<void>;
}

const CreateProject: React.FC<Props> = ({
  isOpen,
  onClose,
  language,
  annotators,
  onSubmit, // onSubmit is a function that takes an object as an argument
}) => {
  const [name, setName] = useState<string>("");
  const [articleName, setArticleName] = useState<string>("");
  const [languageId, setLanguageId] = useState<number>(0);
  const [annotatedBy, setAnnotatedBy] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !articleName || !languageId || !annotatedBy) {
      setError("All fields are required");
      return;
    }
    onSubmit({
      name,
      article_name: articleName,
      language_id: languageId,
      annotated_by: annotatedBy,
    });
    setArticleName("");
    setName("");
    setLanguageId(0);
    setAnnotatedBy(0);
    setError("");
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontWeight={"md"}>Create Project</Text>
            <Divider />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl id="name" isRequired>
                <FormLabel>Project Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  placeholder="Enter Project Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl marginTop={"2%"} id="articleName" isRequired>
                <FormLabel>Article Name</FormLabel>
                <Input
                  type="text"
                  value={articleName}
                  placeholder="Enter Article Name"
                  onChange={(e) => setArticleName(e.target.value)}
                />
              </FormControl>
              <FormControl marginTop={"2%"} id="languageId" isRequired>
                <FormLabel>Language</FormLabel>
                <Select
                  value={languageId}
                  variant="filled"
                  placeholder="Select Language"
                  onChange={(e) => setLanguageId(Number(e.target.value))}
                >
                  {language.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {`${lang.name}(${lang.language_code})`}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl marginTop={"2%"} id="annotatedBy" isRequired>
                <FormLabel>Annotated By</FormLabel>
                <Select
                  value={annotatedBy}
                  variant="filled"
                  placeholder="Select Annotator"
                  onChange={(e: any) => setAnnotatedBy(Number(e.target.value))}
                >
                  {annotators.map((annotator) => (
                    <option key={annotator.id} value={annotator.id}>
                      {annotator.username}
                    </option>
                  ))}
                </Select>
              </FormControl>
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
              <Button colorScheme="blue" mr={3} type="submit" marginY={"3%"}>
                Create
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateProject;
