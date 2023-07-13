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
import { PollCreateBaseModel } from "../models/PollCreateBaseModel";
import { Poll } from "../models/Poll";
import { ClickState } from "../models/ClickState";
import { VoteState } from "../models/BallotState";
import { StakeState } from "../models/StakeState";
import { ToastContainer, toast } from "react-toastify";
import ModalBallot from "./ModalBallot";
import { UserVote } from "../models/UserVote";
import ModalStake from "./ModalStake";
import {
  m_CardBgColor,
  m_CardHeadingColor,
  m_NormalTextColor,
  m_SectionHeadingColor,
} from "../Constants";
import Countdown from "react-countdown";
import { AiOutlineArrowRight, AiOutlineCheckCircle } from "react-icons/ai";
import { BsPatchCheck } from "react-icons/bs";

const countdownRenderer = ({
  hours,
  minutes,
  seconds,
  completed,
}: {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}) => {
  return (
    <Text color={m_SectionHeadingColor}>
      Resets in: {hours}h {minutes}m {seconds}s
    </Text>
  );
  // }
};


const PollCard: React.FC<{
  poll: PollCreateBaseModel;
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
  poll,
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
  const notifyFailure = () => {
    toast.error("Connect your wallet to vote or Stake!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const imgSrc: string =
    poll.description_images === null ? "" : poll.description_images[0];

  const {
    isOpen: isOpenBallot,
    onOpen: onOpenBallot,
    onClose: onCloseBallot,
  } = useDisclosure();
  const {
    isOpen: isOpenStake,
    onOpen: onOpenStake,
    onClose: onCloseStake,
  } = useDisclosure();

  const getExistingVote = () => {
    if (userVotes === undefined) {
      const x: UserVote[] = [];
      return x;
    }
    return userVotes!.filter((x) => x.poll_id === poll.poll_id);
  };

  const getExistingStake = () => {
    if (userStakes === undefined) {
      const x: StakeState[] = [];
      return x;
    }
    return userStakes!.filter((x) => x.poll_id === poll.poll_id);
  };

  return (
    <Card
      variant="elevated"
      w={{ base: "350px", md: "350px" }}
      bgColor={m_CardBgColor}
      // _hover={{ shadow: "lg" }}
      _hover={{
        // transform: "scale(1.05)",
        transform: "scale(1.05)",
      }}
    >
      <Box
        overflow="hidden"
        justifyContent="center"
        display={"flex"}
        alignItems="center"
      >
        <Image
          src={imgSrc}
          alt="Elections"
          filter="auto"
          saturate="60%"
          objectFit="fill"
          w="100%"
          h="100%"
          // width={"200px"}
        />
      </Box>
      <chakra.h3
        color={m_SectionHeadingColor}
        fontSize={{ base: "lg", sm: "2xl" }}
        verticalAlign={"center"}
        fontWeight="bold"
        lineHeight="1.2"
        height={"3em"}
        my={2}
        py={4}
      >
        {poll.poll_title}
        
      </chakra.h3>
      <CardFooter
        justify="space-between"
        p={2}
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        <Button
          colorScheme="whiteAlpha"
          borderWidth={"2px"}
          borderColor={m_NormalTextColor}
          textColor={m_SectionHeadingColor}
          onClick={() => {
            if (!publicKey) {
              notifyFailure();
            } else {
              setClickState({
                poll_id: poll.poll_id,
                button: "vote",
              });
              onOpenBallot();
            }
          }}
          rightIcon={
            getExistingVote() !== undefined &&
            getExistingVote().length !== 0 ? (
              <AiOutlineCheckCircle color="green" size={"30"} />
            ) : undefined
          }
        >
          Vote
        </Button>
        &nbsp;&nbsp;
        <Button
          colorScheme="whiteAlpha"
          borderWidth={"2px"}
          borderColor={m_NormalTextColor}
          textColor={m_SectionHeadingColor}
          onClick={() => {
            if (!publicKey) {
              notifyFailure();
            } else {
              setClickState({
                poll_id: poll.poll_id,
                button: "stake",
              });
              onOpenStake();
            }
          }}
          rightIcon={
            getExistingStake() !== undefined &&
            getExistingStake().length !== 0 ? (
              <AiOutlineCheckCircle color="green" size={"30"} />
            ) : undefined
          }
        >
          Stake
        </Button>
      </CardFooter>
      <Stack direction={"column"} spacing={2} p={2} m={2}>

        <Countdown
          date={new Date(poll.end_date + "Z")}
          renderer={countdownRenderer}
        />
      </Stack>
      <ModalBallot
        poll={poll}
        voteState={voteState}
        setVoteState={setVoteState}
        setStakeState={setStakeState}
        userVotes={userVotes}
        setUserVotes={setUserVotes}
        bearer={bearer}
        isOpen={isOpenBallot}
        onOpen={onOpenBallot}
        onClose={onCloseBallot}
      />

      <ModalStake
        poll={poll}
        setStakeState={setStakeState}
        userStakes={userStakes}
        setUserStakes={setUserStakes}
        bearer={bearer}
        isOpen={isOpenStake}
        onOpen={onOpenStake}
        onClose={onCloseStake}
      />
    </Card>
  );
};

export default PollCard;