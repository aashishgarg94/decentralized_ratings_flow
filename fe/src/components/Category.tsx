import React, { FC, ReactNode, useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, SimpleGrid, Stack, Text, Container } from "@chakra-ui/react";
import RatingsListItem from "./RatingsListItem";
import { m_SectionHeadingColor } from "../Constants";
import {
    chakra,
    Flex,
    Heading,
    Button,
    Icon,
    IconProps,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Image
} from '@chakra-ui/react';
import {
    getAllCategoryContent,
    getTopRatedCategoryContent
  } from "../api/api";

const Category: React.FC<{
    bearer: string;
    guestBearer: string;
    publicKey: string;
}> = ({
    bearer,
    guestBearer,
    publicKey
}) => {
    const { category_name } = useParams<{ category_name: string }>();
    var category_text = "";
    if (category_name === "movies") {
        category_text = "Rate the latest movies on blockchain without fear of manipulation and censorship. Win Rewards for your contributions. Discover ratings for latest Movies or find top rated content.";
    } else if (category_name === "tv_shows") {
        category_text = "Rate the latest TV shows on blockchain without fear of manipulation and censorship. Win Rewards for your contributions. Discover ratings for latest TV shows or find top rated content.";
    } else if (category_name === "web_content") {
        category_text = "Rate the latest web content on blockchain without fear of manipulation and censorship. Win Rewards for your contributions. Discover ratings for latest Web Content or find top rated content.";
    }

    var title_name = "";
    if (category_name === "movies") {
        title_name = "Movies";
    }
    else if (category_name === "tv_shows") {
        title_name = "TV Shows";
    }
    else if (category_name === "web_content") {
        title_name = "Web Content";
    }

    var image_url = "";
    if (category_name === "movies") {
        image_url = "https://cdn.discordapp.com/attachments/995431387333152778/1121366805919830076/mabel_illustration_about_hollywood_movies_including_iconic_char_0e04a349-d944-4164-8447-c85ac1952aca.png";
        // image_url = "https://cdn.discordapp.com/attachments/995431387333152778/1121369141094400020/mabel_modern_looking_collage_about_hollywood_movies_including_i_33b1a84d-dd4b-48bc-9875-0c4e4633c657.png";
        // image_url = "https://cdn.discordapp.com/attachments/995431387333152778/1121369156101607514/mabel_modern_looking_collage_about_hollywood_movies_including_i_81bcb5bd-6c4f-4081-b4db-1f92722e2224.png";
      }
    else if (category_name === "tv_shows") {
        // image_url = "https://cdn.discordapp.com/attachments/995431387333152778/1121370060955594763/mabel_modern_looking_collage_about_tv_series_including_iconic_c_eeef7902-f2c1-4c24-a802-64941cd2ae7f.png";
        image_url = "https://cdn.discordapp.com/attachments/995431387333152778/1121370999036837939/mabel_modern_looking_collage_about_tv_series_including_iconic_c_6fafe9e4-89cf-451d-8090-86f34fa55073.png";
      }
    else if (category_name === "web_content") {
        // image_url = "https://cdn.discordapp.com/attachments/995431387333152778/1121373800383139860/mabel_modern_looking_collage_about_internet_content_including_i_34733d97-a7d9-4708-b294-e55c35599db2.png";
        image_url = "https://cdn.discordapp.com/attachments/995431387333152778/1121374482628612176/mabel_modern_looking_collage_about_internet_content_including_i_e2881bb2-7cb3-40a5-add0-c947df35ab61.png";
      }
    const [ratings, setRatings] = useState<any[]>();
    const [topRatings, setTopRatings] = useState<any[]>();

    useEffect(() => {
        if(!category_name){
            return
        }

        getAllCategoryContent(guestBearer, category_name)
          .then((response: any) => {
            if (guestBearer === "") {
              return;
            }
            const ratingsFromApi = response.data.data;
            const updatedRatings = ratingsFromApi.slice(0, 5).map((x: Object) => {
              return x as any;
            });
            setRatings(updatedRatings);
          })
          .catch((err: any) => {
            console.error(err);
          });
      }, [guestBearer, category_name]);

      useEffect(() => {
        if(!category_name){
            return
        }

        getTopRatedCategoryContent(guestBearer, category_name)
          .then((response: any) => {
            if (guestBearer === "") {
              return;
            }
            const ratingsFromApi = response.data.data;
            const updatedRatings = ratingsFromApi.slice(0, 5).map((x: Object) => {
              return x as any;
            });
            setTopRatings(updatedRatings);
          })
          .catch((err: any) => {
            console.error(err);
          });
      }, [guestBearer, category_name]);

    return (
    <Container maxW={'5xl'} p={2}>
      <Container maxW={'3xl'}>
      <Image
        src={image_url}
        alt="Elections"
        filter="auto"
        saturate="60%"
        // width={"200px"}
      />
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          pt={{ base: 10, md: 20 }}>
          <Heading
            fontWeight={600}
            color={"gray.200"}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Decentralized Ratings for <br />
            <Text as={'span'} color={'purple.400'}>
              { title_name }
            </Text>
          </Heading>
          <Text color={'gray.200'}>
            { category_text }
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Button
              colorScheme={'purple'}
              bg={'purple.400'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'purple.400',
                cursor: "auto"
              }}>
              Check out!
            </Button>
          </Stack>
        </Stack>
      </Container>
      <Container maxW={'5xl'}>
      <Stack minW={"100%"} direction={{base: "column", sm: "column"}} justify={"flex-start"} pt={32}>
        <Stack direction='column' minW={"30%"}>
            <Heading color={'purple.400'} textAlign={"left"}>
            Recent Ratings
            </Heading>
            </Stack>
            <Stack direction='column' minW={"70%"} pt={10}>
            {ratings ? ratings.map((rating) => (
          <RatingsListItem
            rating={rating}
            />
            )): null}
            </Stack>
        </Stack>
        </Container>

        <Container maxW={'5xl'}>
      <Stack minW={"100%"} direction={{base: "column", sm: "column"}} justify={"flex-start"} pt={20}>
        <Stack direction='column' minW={"30%"}>
            <Heading color={'purple.400'} textAlign={"left"}>
            Top Rated Content
            </Heading>
            </Stack>
            <Stack direction='column' minW={"70%"} pt={10}>
            {topRatings ? topRatings.map((rating) => (
          <RatingsListItem
            rating={rating}
            />
            )): null}
            </Stack>
        </Stack>
        </Container>
        </Container>
        );
};

export default Category;