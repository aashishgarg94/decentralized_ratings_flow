import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, Image, Box, Progress, Stack, Center,
    Editable, EditablePreview, EditableInput, InputGroup, Input, InputLeftAddon,
    } from '@chakra-ui/react'
import {PollCreateBaseModel} from '../models/PollCreateBaseModel'
// import {Poll} from '../models/Poll'
// import { start } from "repl";
import RangeSelector from './RangeSelector'
import { StakeState } from "../models/StakeState";
import { castStake } from "../api/api";
// import StakeSelector from "./StakeSelector";
// import { RangeSlider } from "rsuite";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  

const DEFAULT_SELECTION_RANGE=[40, 60];
const DEFAULT_STAKING_AMOUNT=100;

const Stake: React.FC<{poll: PollCreateBaseModel, 
    setStakeState: React.Dispatch<React.SetStateAction<StakeState>>, 
    userStakes: StakeState[] | undefined, 
    setUserStakes: React.Dispatch<React.SetStateAction<StakeState[] | undefined>>
    bearer: string}> = ({poll, setStakeState, userStakes, setUserStakes, bearer}) => {
        
    const getExistingStake = () => {
        if(userStakes === undefined){
            const x: StakeState[] = [];
            return x;
        }
        return userStakes!.filter((x) => x.poll_id === poll.poll_id)
    };

    const notifySuccess = () => {
        toast.success('🦄Staking Successfull!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    const notifyFailure = () => {
        toast.error('Staking Failed, Try again!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    const [tempRange, setTempRange] = useState(DEFAULT_SELECTION_RANGE);
    const [tokensStaked, setTokensStaked] = useState(DEFAULT_STAKING_AMOUNT);

    return (
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
    <Card maxW='lg' p={5}>
        <CardHeader>
            <Heading size='md'> {poll.poll_title} </Heading>
        </CardHeader>
    
        <Text flex='1'>
            What percentage of people would have voted yes in this poll?
        </Text>
        {
            getExistingStake().length === 0 ?
            <Stack direction={'column'} pt={7}>
                {/* <RangeSelector min={0} max={100} stepToNumber={85} stepToIndex={1} stepByNumber={10} defaultValue={[40, 60]} aria-label={['min', 'max'], setTempRange}/> */}
                <RangeSelector selectionRange={tempRange} setSelectionRange={setTempRange}/>
                
                <Text>Between {tempRange[0]}% and {tempRange[1]}%</Text>
                
                <Stack direction='row' pt={10} justifyContent={'center'} textAlign={'center'}>
                <Text>Staking Amount</Text>
                {/* <Editable flex={1} defaultValue={tokensStaked.toString()}>
                    <EditablePreview />
                    <EditableInput />
                </Editable> */}
                <InputGroup>
                    <InputLeftAddon children='$' />
                    <Input type='number' placeholder='Amount' defaultValue={tokensStaked.toString()} isRequired={true} onInput={(x) => {
                        // console.log(x.currentTarget.value);
                        setTokensStaked(Number(x.currentTarget.value))
                    }} />
                </InputGroup>
                {/* <input></input> */}
                </Stack>
                <Text flex={1} textAlign={'center'}>
                    Potential Winnings: ${tokensStaked*(1.2)}
                </Text>
                <Button onClick={() => {
                    const updatedStakeState = {
                        "poll_id": poll.poll_id,
                        "range_begin": tempRange[0],
                        "range_end": tempRange[1],
                        "tokens_staked": tokensStaked
                    } as StakeState;
                    
                    
                    castStake(bearer, updatedStakeState).then( (response: any) => {
                        if( response.data.InternalResponseCode === 0){
                            setStakeState(updatedStakeState);
                            setUserStakes([
                                ...userStakes!,
                                updatedStakeState
                            ]);

                            notifySuccess();
                            setTempRange(DEFAULT_SELECTION_RANGE);
                            setTokensStaked(DEFAULT_STAKING_AMOUNT);
                            console.log("success", response);
                        }else{
                            notifyFailure();
                            console.log("failure", response);
                        }
                    }).catch ((err: any) => {
                        notifyFailure();
                        console.error("err", err);
                    });

                }}>Submit</Button>
            </Stack>:
            <Stack direction={'column'} p={2}>
                <Text fontWeight={"bold"} color={'gray.200'}>Your Answer</Text>
                <Text color={'purple.200'}>Between {getExistingStake()![0].range_begin}% and {getExistingStake()![0].range_end}%</Text>
                <Text fontWeight={"bold"} color={'gray.200'}>Staked amount</Text>
                <Text color={'purple.200'}>$ {getExistingStake()![0].tokens_staked}</Text>
            </Stack>
            // <h1>Already Submitted</h1>
        }
        
        {/* <StakeSelector/> */}

        {/* <Stack direction='row' pt={10} justifyContent={'center'} textAlign={'center'}>
            <Editable flex={1} defaultValue='Enter staking amount'>
                <EditablePreview />
                <EditableInput />
            </Editable>
            <Text flex={1} textAlign={'center'}>
                You could win $100
            </Text>
        </Stack> */}

    </Card>
    </Center>
    )
};

export default Stake;