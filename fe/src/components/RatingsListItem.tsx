import React, { useEffect, useRef, useState } from "react";
import {
  chakra,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Image,
  Box,
  Progress,
  Stack,
  Editable,
  EditablePreview,
  EditableInput,
  useDisclosure,
  useTimeout,
  Badge,
} from "@chakra-ui/react";

const RatingsListItem: React.FC<{
  rating: any
}> = ({
  rating
}) => {
    return (
        <Card
  direction={{ base: 'column', sm: 'row' }}
  overflow='hidden'
  variant='outline'
  bg="#1A1B1E"
  borderColor='#1A1B1E'
>
  <Image
    objectFit='cover'
    width={{ base: '100%', sm: '100px' }}
    minW={{ base: '100%', sm: '100px' }}
    maxW={{ base: '100%', sm: '100px' }}
    height={{ base: '100%', sm: '100px' }}
    minH={{ base: '100%', sm: '100px' }}
    maxH={{ base: '100%', sm: '100px' }}
    src={rating.image_url}
    alt='Caffe Latte'
  />
    <Stack direction='row' justifyContent={"flex-start"} minW={"50%"}>
        <Box textAlign={"left"} pt={{base: 2, sm: 2}} px={{base: 2, sm: 10}}>
      <Heading size='md' color="gray.400">{rating.content_title}</Heading>
      <Text pt='2' color="gray.400">
        Category: {rating.category}
      </Text>
      </Box>
        </Stack>
        <Stack direction='row' justifyContent={"flex-start"} minW={"50%"}>
        <Box textAlign={"left"} pt={{base: 0, sm: 2}} px={{base: 2, sm: 10}} pb={2}>
      <Text pt='2' color="gray.400">
        {rating.rating} / 10
      </Text>
      <Text color="gray.400">
        {rating.ratings_count} Ratings
      </Text>
    </Box>
    </Stack>
</Card>
    )
}

export default RatingsListItem;