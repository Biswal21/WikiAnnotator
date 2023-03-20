import {
  Flex,
  useToast,
  Text,
  Textarea,
  Button,
  position,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import { Sentence } from "../types/interfaces";
import axiosInstance from "../utils/axiosAuth";
interface Props {
  sentence: Sentence;
  lang_code: string;
}

const SentenceCard: React.FC<Props> = ({ sentence, lang_code }) => {
  const [lang, setLang] = useState<Language>("hi");
  const [text, setText] = useState<string>("");
  const toast = useToast();
  const toastIdRef = React.useRef<any>();
  useEffect(() => {
    if (lang_code) {
      setLang(lang_code as Language);
    }
  }, []);

  const handleUpdate = async (sentence: Sentence) => {
    const data = {
      id: sentence.id,
      project_id: sentence.project_id,
      annotated_sentence: text,
      original_sentence: sentence.original_sentence,
    };
    try {
      const response = await axiosInstance.put(
        `/project/${sentence.project_id}/sentences/update/`,
        data
      );
      toastIdRef.current = toast({
        title: "Success",
        description: "Sentence Updated",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating sentence:", error);
      toastIdRef.current = toast({
        title: "Error",
        description: "Something Went Wrong, couldn't annotate sentence",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <Flex key={sentence.id} marginX={"4%"} marginBottom={"2%"}>
      <Text mb={2} w={"50%"} marginRight={"1%"}>
        {sentence.original_sentence}
      </Text>
      <Flex alignItems={"center"}>
        <ReactTransliterate
          renderComponent={(props) => (
            <Textarea
              placeholder="Annotated Sentence"
              value={text ?? ""}
              {...props}
              backgroundColor={"whiteAlpha.900"}
              variant={"outline"}
              w={"100vh"}
              //   position={"relative"}
            />
          )}
          value={
            sentence.annotated_sentence ? sentence.annotated_sentence : text
          }
          onChangeText={(text) => {
            setText(text);
          }}
          lang={lang}
        />
        <Button
          colorScheme={"blue"}
          marginLeft={"1%"}
          onClick={async () => {
            await handleUpdate(sentence);
          }}
        >
          Submit
        </Button>
      </Flex>
    </Flex>
  );
};

export default SentenceCard;
