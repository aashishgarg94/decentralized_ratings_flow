import React from "react";
import { Box, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Poll } from "../models/Poll";
import { PollCreateBaseModel } from "../models/PollCreateBaseModel";
import PollCard from "./PollCard";
import { ClickState } from "../models/ClickState";
import { VoteState } from "../models/BallotState";
import { StakeState } from "../models/StakeState";
import { UserVote } from "../models/UserVote";
import { m_SectionHeadingColor } from "../Constants";
import { ToastContainer } from "react-toastify";

const PollCardGrid: React.FC<{
  polls: PollCreateBaseModel[];
  setClickState: React.Dispatch<React.SetStateAction<ClickState>>;
  voteState: VoteState;
  setVoteState: React.Dispatch<React.SetStateAction<VoteState>>;
  setStakeState: React.Dispatch<React.SetStateAction<StakeState>>;
  userVotes: UserVote[] | undefined;
  setUserVotes: React.Dispatch<React.SetStateAction<UserVote[] | undefined>>;
  userStakes: StakeState[] | undefined;
  setUserStakes: React.Dispatch<React.SetStateAction<StakeState[] | undefined>>;
  bearer: string;
  publicKey: any;
}> = ({
  polls,
  setClickState,
  voteState,
  setVoteState,
  setStakeState,
  userVotes,
  setUserVotes,
  userStakes,
  setUserStakes,
  bearer,
  publicKey,
}) => {
  return (
    // <SimpleGrid p={4} spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
    <Box pt={20}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Text fontSize="2xl" color={m_SectionHeadingColor} fontWeight={500}>
        Ongoing Polls
      </Text>
      <Stack
        direction={{ base: "column", md: "row" }}
        pt={10}
        pb={5}
        spacing={10}
        mx={4}
        justifyContent={"center"}
        textAlign={"center"}
      >
        {polls.map((poll) => (
          <PollCard
            poll={poll}
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
        ))}
      </Stack>
    </Box>
  );
};

export default PollCardGrid;