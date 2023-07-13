import React from "react";
import { Box, SimpleGrid, Stack, Text, Container } from "@chakra-ui/react";
import RatingsListItem from "./RatingsListItem";
import { m_SectionHeadingColor } from "../Constants";

const RatingsListGrid: React.FC<{
  ratings: any[];
  title: string;
}> = ({
  ratings,
  title
}) => {
  return (
    <Container maxW={"5xl"} p={2}>
    <Box pt={20}>
      <Text fontSize={{base: "2xl", sm: "3xl"}} color={"purple.400"} fontWeight={"bold"}>
        {title}
      </Text>
      <Stack
        direction={{ base: "column" }}
        pt={10}
        pb={5}
        spacing={2}
        mx={4}
        justifyContent={"center"}
        textAlign={"center"}
      >
        {ratings.map((rating) => (
          <RatingsListItem
            rating={rating}
          />
        ))}
      </Stack>
    </Box>
    </Container>
  );
};

export default RatingsListGrid;