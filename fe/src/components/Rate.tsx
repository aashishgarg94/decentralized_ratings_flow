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
    AccordionIcon
} from '@chakra-ui/react';
import PollCardGrid from "./PollCardGrid";
  import { ClickState } from "../models/ClickState";
  import { VoteState } from "../models/BallotState";
  import { StakeState } from "../models/StakeState";
  
  import { PollCreateBaseModel } from "../models/PollCreateBaseModel";
  import Rewards from "./Rewards";
  import Actors from "./Actors";
  import {
    login,
    getPolls,
    getActivePolls,
    castVote,
    getVote,
    getAllVotesForUser,
    castStake,
    getStake,
    getAllStakesForUser
  } from "../api/api";
  import { UserVote } from "../models/UserVote";

const Rate: React.FC<{
    bearer: string;
    guestBearer: string;
    publicKey: string;
}> = ({
    bearer,
    guestBearer,
    publicKey
}) => {

    const [clickState, setClickState] = useState<ClickState>({
        poll_id: "",
        button: "",
      });
    
      const [voteState, setVoteState] = useState<VoteState>({
        poll_id: "",
        option: "",
      });
    
      const [stakeState, setStakeState] = useState<StakeState>({
        poll_id: "",
        range_begin: -1,
        range_end: -1,
        tokens_staked: 0,
      });

      const [polls, setPolls] = useState<PollCreateBaseModel[]>();
      const [userVotes, setUserVotes] = useState<UserVote[]>();
      const [userStakes, setUserStakes] = useState<StakeState[]>();

      useEffect(() => {
        getActivePolls(guestBearer)
          .then((response: any) => {
            if (guestBearer === "") {
              return;
            }
            const pollsFromApi = response.data.data;
            setPolls(pollsFromApi);
          })
          .catch((err: any) => {
            console.error(err);
          });
      }, [guestBearer]);

      useEffect(() => {
        if (bearer === "") {
          return;
        }
    
      getAllVotesForUser(bearer)
      .then((response: any) => {
        if (response.data.data == undefined) {
          setUserVotes([]);
        } else {
          const uv = response.data?.data.map((x: any) => {
            return {
              poll_id: x.poll_id,
              option: x.encrypted_vote,
            } as UserVote;
          });
          setUserVotes(uv);
        }
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, [bearer]);

  useEffect(() => {
    if (bearer === "") {
      return;
    }

    getAllStakesForUser(bearer)
      .then((response: any) => {
        if (response.data.data == undefined) {
          setUserStakes([]);
        } else {
          const us = response.data?.data.map((x: any) => {
            return {
              poll_id: x.poll_id,
              range_begin: x.range_begin,
              range_end: x.range_end,
              tokens_staked: x.tokens_staked,
            } as StakeState;
          });
          if (us.length > 0) {
            setUserStakes(us);
          }
        }
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, [bearer]);

  const clickedPoll =
    polls !== undefined
      ? polls.filter((poll) => poll.poll_id === clickState.poll_id)
      : null;

  const packageObjectId =
  "0x4c5b5c643a657b8fd1d9be91f026550f445fb3965ab3bf801b208961b26f15c3";

  const adminId =
  "0x31483167591f738d62bdb9da456c58f813976e9b5025e020add83525c8c6c007";
    return (
    <Container maxW={'5xl'} p={2}>
            <Container maxW={'3xl'}>
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
            Rate, Stake and Earn <br />
            <Text as={'span'} color={'purple.400'}>
              Win Rewards
            </Text>
          </Heading>
          <Text color={'gray.200'}>
            Vote for any movie, TV show or web content in a decentralized way! Predict the ratings for all active polls to earn rewards! Our voters are also rewarded for their participation.
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
      {polls !== undefined ? (
        <PollCardGrid
          polls={polls}
          setClickState={setClickState}
          voteState={voteState}
          setVoteState={setVoteState}
          setStakeState={setStakeState}
          userVotes={userVotes}
          setUserVotes={setUserVotes}
          userStakes={userStakes}
          setUserStakes={setUserStakes}
          bearer={bearer}
          publicKey={publicKey}
        />
      ) : null}
        <Rewards />
        <Actors />
        </Container>
        );
};

export default Rate;