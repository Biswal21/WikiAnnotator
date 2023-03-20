import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Card, IconButton } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Card>
      <IconButton
        aria-label={"Back"}
        icon={<ChevronLeftIcon color={"black"} w={8} h={8} />}
        variant="solid"
        onClick={() => navigate(-1)}
        colorScheme="blue.100"
      />
    </Card>
  );
};

export default BackButton;
