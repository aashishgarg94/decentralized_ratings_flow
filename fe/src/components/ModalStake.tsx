import React, { useState } from "react";
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
  Center,
  Editable,
  EditablePreview,
  EditableInput,
  InputGroup,
  Input,
  InputLeftAddon,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
} from "@chakra-ui/react";
import { PollCreateBaseModel } from "../models/PollCreateBaseModel";
import RangeSelector from "./RangeSelector";
import { StakeState } from "../models/StakeState";
import { castStake } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as t from "@onflow/types";

import {
  m_CardBgColor,
  m_CardHeadingColor,
  m_NormalTextColor,
  m_SectionHeadingColor,
  packageAddress
} from "../Constants";

const DEFAULT_SELECTION_RANGE = [40, 60];
const DEFAULT_STAKING_AMOUNT = 100;

const Stake: React.FC<{
  poll: PollCreateBaseModel;
  setStakeState: React.Dispatch<React.SetStateAction<StakeState>>;
  userStakes: StakeState[] | undefined;
  setUserStakes: React.Dispatch<React.SetStateAction<StakeState[] | undefined>>;
  bearer: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}> = ({
  poll,
  setStakeState,
  userStakes,
  setUserStakes,
  bearer,
  isOpen,
  onOpen,
  onClose,
}) => {
  const getExistingStake = () => {
    if (userStakes === undefined) {
      const x: StakeState[] = [];
      return x;
    }
    return userStakes!.filter((x) => x.poll_id === poll.poll_id);
  };

  const notifySuccess = () => {
    toast.success("🦄Staking Successfull!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const notifyFailure = () => {
    toast.error("Staking Failed, Try again!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const [tempRange, setTempRange] = useState(DEFAULT_SELECTION_RANGE);
  const [tokensStaked, setTokensStaked] = useState(DEFAULT_STAKING_AMOUNT);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  async function createStake(
    updatedStakeState: StakeState
  ) {
    try {
      const transactionId = await fcl.mutate({
        cadence: `
        import Polls from 0x163a1031b82fbaf9
      
        transaction(pollId: String, encryptedVote: String, tokensStaked: UInt64, rangeBegin: UInt8, rangeEnd: UInt8) {
          let account: AuthAccount
  
          prepare(account: AuthAccount) {
            self.account = account
          }
          execute{
          Polls.addStake(account: self.account, poll_id: pollId, encrypted_vote: encryptedVote, staked_amount: tokensStaked, range_begin: rangeBegin, range_end: rangeEnd)
          }
        }
        `,
        args: (arg: any, t: any) => [arg(poll.poll_address, t.String), arg(updatedStakeState.tokens_staked, t.UInt64), arg(updatedStakeState.range_begin, t.UInt8), arg(updatedStakeState.range_end, t.UInt8)],
        limit: 50
      })
      
      const transaction = await fcl.tx(transactionId).onceSealed()
      console.log(transaction) // The transactions status and events after being sealed
      
      
        castStake(bearer, updatedStakeState)
        .then((response: any) => {
          console.log(userStakes);
          console.log(response);
          if (response.data.InternalResponseCode === 0) {
            setStakeState(updatedStakeState);
            setUserStakes([
              ...userStakes!,
              updatedStakeState,
            ]);

            notifySuccess();
            setTempRange(DEFAULT_SELECTION_RANGE);
            setTokensStaked(DEFAULT_STAKING_AMOUNT);
            console.log("success", response);
          } else {
            notifyFailure();
            console.log("failure", response);
          }
        })

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
        <ModalHeader textColor={m_SectionHeadingColor}>Stake</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Center>
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
            <Card maxW="lg" p={5} shadow={"none"} bgColor={m_CardBgColor}>
              <CardHeader>
                <Heading size="md" textColor={m_CardHeadingColor}>
                  {" "}
                  {poll.poll_title}{" "}
                </Heading>
              </CardHeader>

              <Text flex="1" textColor={m_CardHeadingColor}>
                What percentage of people would have voted yes in this poll?
              </Text>
              {
                getExistingStake().length === 0 ? (
                  <Stack direction={"column"} pt={7}>
                    {/* <RangeSelector min={0} max={100} stepToNumber={85} stepToIndex={1} stepByNumber={10} defaultValue={[40, 60]} aria-label={['min', 'max'], setTempRange}/> */}
                    <RangeSelector
                      selectionRange={tempRange}
                      setSelectionRange={setTempRange}
                    />

                    <Text textColor={m_SectionHeadingColor}>
                      Between {tempRange[0]}% and {tempRange[1]}%
                    </Text>

                    <Stack
                      direction="row"
                      pt={10}
                      justifyContent={"center"}
                      textAlign={"center"}
                    >
                      <Text textColor={m_CardHeadingColor}>Staking Amount</Text>
                      <InputGroup>
                        <InputLeftAddon children="$" color={"green.300"} />
                        <Input
                          type="number"
                          placeholder="Amount"
                          defaultValue={tokensStaked.toString()}
                          isRequired={true}
                          onInput={(x) => {
                            // console.log(x.currentTarget.value);
                            setTokensStaked(Number(x.currentTarget.value));
                          }}
                          textColor={m_SectionHeadingColor}
                        />
                      </InputGroup>
                    </Stack>
                    <Text
                      flex={1}
                      textAlign={"center"}
                      textColor={m_CardHeadingColor}
                    >
                      Potential Winnings: ${tokensStaked * 1.2}
                    </Text>
                    <Button
                      colorScheme="whiteAlpha"
                      borderWidth={"2px"}
                      borderColor={m_NormalTextColor}
                      textColor={m_SectionHeadingColor}
                      onClick={() => {
                        const updatedStakeState = {
                          poll_id: poll.poll_id,
                          range_begin: tempRange[0],
                          range_end: tempRange[1],
                          tokens_staked: tokensStaked,
                        } as StakeState;

                        createStake(updatedStakeState);
                      }}
                    >
                      Submit
                    </Button>
                  </Stack>
                ) : (
                  <Stack direction={"column"} py={2}>
                    <Text
                      color={"purple.200"}
                      flex={1}
                      justifyContent={"center"}
                      textAlign={"center"}
                      fontSize={{ base: "2xl", sm: "2xl", md: "2xl" }}
                    >
                      Staked on {getExistingStake()![0].range_begin}% -{" "}
                      {getExistingStake()![0].range_end}%
                    </Text>
                    <Text
                      color={"purple.200"}
                      flex={1}
                      justifyContent={"center"}
                      textAlign={"center"}
                      fontSize={{ base: "2xl", sm: "2xl", md: "2xl" }}
                    >
                      For ${getExistingStake()![0].tokens_staked}
                    </Text>
                  </Stack>
                )
              }

            </Card>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Stake;
