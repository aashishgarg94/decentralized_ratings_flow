import React from "react";
import { Box, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { UserTxnCreateBaseModel } from "../models/UserTxnCreateBaseModel";
import UserTxnCard from "./UserTxnCard";

const PollCardGrid: React.FC<{
    userTxns: UserTxnCreateBaseModel[];
}> = ({
  userTxns
}) => {
  return (
    <Box pt={20}>
      <Text fontSize="2xl" color={"gray.200"} fontWeight={500}>
        Past Stakes and Votes
      </Text>
      <Stack
        direction={{ base: "column"}}
        pt={10}
        pb={5}
        spacing={2}
        mx={4}
        justifyContent={"left"}
        textAlign={"left"}
      >
        {userTxns.map((userTxn) => (
          <UserTxnCard
            userTxn={userTxn}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default PollCardGrid;
