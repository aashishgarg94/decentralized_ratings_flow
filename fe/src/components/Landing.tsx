import { Link } from "react-router-dom";

import { m_SectionHeadingColor } from "../Constants";
import {
    Text,
    chakra,
    Flex,
    Container,
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
import React, { FC, ReactNode, useMemo, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./header";
import FAQ from "./FAQ";
import CommunityCard from "./CommunityCard";
import Rewards from "./Rewards";
import Actors from "./Actors";


import * as tweetnacl from "tweetnacl";
import PollCardGrid from "./PollCardGrid";
import UserTxnList from "./UserTxnList";
import RatingsListGrid from "./RatingsListGrid";

import { ClickState } from "../models/ClickState";
import { VoteState } from "../models/BallotState";
import { StakeState } from "../models/StakeState";

import { PollCreateBaseModel } from "../models/PollCreateBaseModel";
import {
  login,
  getPolls,
  getActivePolls,
  castVote,
  getVote,
  getAllVotesForUser,
  castStake,
  getStake,
  getAllStakesForUser,
  getAllVoterTxns,
  getAllContent,
  getTopRatedContent
} from "../api/api";
import { UserVote } from "../models/UserVote";
import About from "./About";
const Landing: React.FC<{
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
      const [ratings, setRatings] = useState<any[]>();
      const [topRatings, setTopRatings] = useState<any[]>();
      const [userVotes, setUserVotes] = useState<UserVote[]>();
      const [userStakes, setUserStakes] = useState<StakeState[]>();
      const [userTxns, setUserTxns] = useState<any[]>();

      useEffect(() => {
        getActivePolls(guestBearer)
          .then((response: any) => {
            if (guestBearer === "") {
              return;
            }
            const pollsFromApi = response.data.data;
            const updatedPolls = pollsFromApi.slice(0, 3).map((x: Object) => {
              return x as PollCreateBaseModel;
            });
            setPolls(updatedPolls);
          })
          .catch((err: any) => {
            console.error(err);
          });
      }, [guestBearer]);
    
      useEffect(() => {
        getAllContent(guestBearer)
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
      }, [guestBearer]);
    
      useEffect(() => {
        getTopRatedContent(guestBearer)
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

  useEffect(() => {
    if (bearer === "") {
      return;
    }

    getAllVoterTxns(bearer)
      .then((response: any) => {
        if (response.data.data == undefined) {
          setUserTxns([]);
        } else {
          const ut = response.data?.data.map((x: any) => {
            return {
              poll_id: x.poll_id,
              poll_title: x.poll_title,
              end_date: x.end_date,
              vote: x.voter_vote,
              range_begin: x.staker_range_begin,
              range_end: x.staker_range_end,
              tokens_staked: x.staker_tokens_staked,
              result: x.result,
              reward: x.staker_reward,
            } as any;
          });
          if (ut.length > 0) {
            setUserTxns(ut);
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

    return (
        <Container maxW={'5xl'} p={2}>
      <About></About>
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
      {ratings !== undefined ?
      <div>
      <RatingsListGrid ratings={ratings} title={"Recent Ratings"}/>
      <Flex align={'center'} justify={'center'}>
      <Link to={"/rate"}><Text color="gray.800" fontWeight={"semibold"} bgColor={"purple.400"} fontSize={"xl"} maxW={"2xl"} py={2} px={10} borderRadius={"5"}>{"Vote for the latest content ->"}</Text></Link>
      </Flex>
      </div> : null}
      {topRatings !== undefined ?
      <div>
      <RatingsListGrid ratings={topRatings} title={"Top Ratings"}/>
      <Flex align={'center'} justify={'center'}>
      <Link to={"/rate"}><Text color="gray.800" fontWeight={"semibold"} bgColor={"purple.400"} fontSize={"xl"} maxW={"2xl"} py={2} px={10} borderRadius={"5"}>{"Vote for your favourite content ->"}</Text></Link>
      </Flex>
      </div> : null}
      <FAQ />
      <CommunityCard />
        </Container>
        );
};

export default Landing;