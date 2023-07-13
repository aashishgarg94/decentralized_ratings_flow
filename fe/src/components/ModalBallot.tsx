import React from "react";
import { castVote } from "../api/api";
import {
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
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Editable,
  EditablePreview,
  EditableInput,
  Center,
  useDisclosure,
  Modal,
  ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as t from "@onflow/types";

import { PollCreateBaseModel } from "../models/PollCreateBaseModel";
import { Poll } from "../models/Poll";
import { VoteState } from "../models/BallotState";
import { StakeState } from "../models/StakeState";

import { start } from "repl";
import RangeSelector from "./RangeSelector";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { UserVote } from "../models/UserVote";
import { m_CardBgColor, m_CardHeadingColor, m_NormalTextColor, m_SectionHeadingColor } from "../Constants";
 import { packageAddress } from "../Constants";
import { getEncryptedVote } from "../encryption/encryption";

const ModalBallot: React.FC<{
  poll: PollCreateBaseModel;
  voteState: VoteState;
  setVoteState: React.Dispatch<React.SetStateAction<VoteState>>;
  setStakeState: React.Dispatch<React.SetStateAction<StakeState>>;
  userVotes: UserVote[] | undefined;
  setUserVotes: React.Dispatch<React.SetStateAction<UserVote[] | undefined>>;
  bearer: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}> = ({
  poll,
  voteState,
  setVoteState,
  setStakeState,
  userVotes,
  setUserVotes,
  bearer,
  isOpen,
  onOpen,
  onClose,
}) => {
  const getExistingVote = () => {
    if (userVotes === undefined) {
      const x: UserVote[] = [];
      return x;
    }
    return userVotes!.filter((x) => x.poll_id === poll.poll_id);
  };

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  async function createVote(
    sel: VoteState,
    vote: number
  ) {
    try {
      const encryptedVote = getEncryptedVote(vote, poll.public_key);
      const transactionId = await fcl.mutate({
        cadence: `
        import Polls from 0x163a1031b82fbaf9
      
        transaction(pollId: String, encryptedVote: String) {
          let account: AuthAccount
  
          prepare(account: AuthAccount) {
            self.account = account
          }
          execute{
          Polls.addVote(account: self.account, poll_id: pollId, encrypted_vote: encryptedVote)
          }
        }
        `,
        args: (arg: any, t: any) => [arg(poll.poll_address, t.String), arg(encryptedVote, t.String)],
        limit: 50
      })
      
      const transaction = await fcl.tx(transactionId).onceSealed()
      console.log(transaction) // The transactions status and events after being sealed
      
      
        castVote(bearer, poll.poll_id, encryptedVote)
        .then((response: any) => {
          setVoteState(sel);
          const updatedUserVotes = [...userVotes!, sel];
          setUserVotes(updatedUserVotes);
          console.log(userVotes!);
        })
        .catch((err: any) => {
          console.error(err);
        });

    } catch (e) {
      console.error("executeMoveCall failed", e);
      alert("executeMoveCall failed (see response in the console)");
    }
  }

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent bgColor={m_CardBgColor}>
        <ModalHeader textColor={m_SectionHeadingColor}>Vote</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Center>
            <Card maxW="md" justifyContent="center" p={5} shadow={"none"} bgColor={m_CardBgColor}>
              <CardHeader>
                <Heading size="md" textColor={m_CardHeadingColor}> {poll.poll_title} </Heading>
              </CardHeader>
              <CardBody>
                <Box
                  overflow="hidden"
                  justifyContent="center"
                  display={"flex"}
                  alignItems="center"
                ></Box>
                <Text textColor={m_NormalTextColor}> {poll.description} </Text>
              </CardBody>

              {getExistingVote() !== undefined &&
              getExistingVote().length !== 0 ? (
                <Box flex={1} justifyContent={"center"} textAlign={"center"}>
                  {/* <Text fontWeight={"bold"} color={"gray.200"}>
                    You Voted:
                  </Text> */}
                  <Text
                    color={"purple.200"}
                    fontWeight={600}
                    fontSize={{ base: "sm" }}
                  >
                    {getExistingVote()[0].option}
                  </Text>
                </Box>
              ) : undefined}
              <CardFooter
                hidden={
                  getExistingVote() !== undefined &&
                  getExistingVote().length !== 0
                }
                justify="space-between"
                flexWrap="wrap"
                sx={{
                  "& > button": {
                    minW: "136px",
                  },
                }}
              >
                <Stack flex={1} direction={"row"}>
                  <Button
                    flex={0.5}
                    onClick={() => {
                      const sel = {
                        poll_id: poll.poll_id,
                        option: poll.options[0],
                      };
                      createVote(sel, 0)
                    }}
                  >
                    {poll.options[0]}
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    flex={0.5}
                    onClick={() => {
                      const sel = {
                        poll_id: poll.poll_id,
                        option: poll.options[1],
                      };
                      createVote(sel, 1)
                    }}
                  >
                    {poll.options[1]}
                  </Button>
                </Stack>
              </CardFooter>
            </Card>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalBallot;
