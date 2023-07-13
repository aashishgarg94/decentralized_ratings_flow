import React from "react";
import {castVote} from "../api/api";
import { Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, Image, Box, Progress, Stack, 
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    Editable, EditablePreview, EditableInput,
    Center
    } from '@chakra-ui/react'
import {PollCreateBaseModel} from '../models/PollCreateBaseModel'
import {Poll} from '../models/Poll'
import {VoteState} from '../models/BallotState'
import {StakeState} from '../models/StakeState'

import { start } from "repl";
import RangeSelector from './RangeSelector'
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { UserVote } from "../models/UserVote";

const Ballot: React.FC<{poll: PollCreateBaseModel, voteState: VoteState,
    setVoteState: React.Dispatch<React.SetStateAction<VoteState>>, 
    setStakeState: React.Dispatch<React.SetStateAction<StakeState>>, 
    userVotes: UserVote[] | undefined, 
    setUserVotes: React.Dispatch<React.SetStateAction<UserVote[] | undefined>>, bearer: string}> = ({poll, voteState, setVoteState, setStakeState, userVotes, setUserVotes, bearer}) => {
    // let start_time = new Date(poll.begin_date);
    // let end_time = new Date(poll.end_date);
    // let curr_time = new Date();

    // let total_time = (end_time.valueOf() - start_time.valueOf());
    // let elapsed_time = (curr_time.valueOf() - start_time.valueOf());
    // let time_remaining = (end_time.valueOf() - curr_time.valueOf());
    // let pct_time_passed = 100 * elapsed_time / total_time;

    // let millisecondsToStr = (milliseconds: number) => {
    //     // TIP: to find current time in milliseconds, use:
    //     // var  current_time_milliseconds = new Date().getTime();
    
    //     let numberEnding = (number: number) => {
    //         return (number > 1) ? 's' : '';
    //     };
    
    //     var temp = Math.floor(milliseconds / 1000);
    //     var years = Math.floor(temp / 31536000);
    //     if (years) {
    //         return years + ' year' + numberEnding(years);
    //     }
    //     //TODO: Months! Maybe weeks? 
    //     var days = Math.floor((temp %= 31536000) / 86400);
    //     if (days) {
    //         return days + ' day' + numberEnding(days);
    //     }
    //     var hours = Math.floor((temp %= 86400) / 3600);
    //     if (hours) {
    //         return hours + ' hour' + numberEnding(hours);
    //     }
    //     var minutes = Math.floor((temp %= 3600) / 60);
    //     if (minutes) {
    //         return minutes + ' minute' + numberEnding(minutes);
    //     }
    //     var seconds = temp % 60;
    //     if (seconds) {
    //         return seconds + ' second' + numberEnding(seconds);
    //     }
    //     return 'less than a second'; //'just now' //or other string you like;
    // };

    const getExistingVote = () => {
        if(userVotes === undefined){
            const x: UserVote[] = [];
            return x;
        }
        return userVotes!.filter((x) => x.poll_id === poll.poll_id)
    };

    console.log("Existing vote: ", getExistingVote());
    
    return (
    <Center>
    <Card maxW='md' justifyContent='center' p={5}>
        <CardHeader>
            <Heading size='md'> {poll.poll_title} </Heading>
        </CardHeader>
        <CardBody>
            <Box overflow='hidden' justifyContent='center' display={'flex'} alignItems='center'>
            </Box>
            <Text> {poll.description} </Text>
        </CardBody>

        {/* {existingVote !== undefined || voteState.poll_id === poll.poll_id? <h1>Your vote: {existingVote}</h1> : <h1>No Vote Yet</h1>} */}
        {getExistingVote() !== undefined && getExistingVote().length !== 0 ? 
            <div>
            <Text fontWeight={"bold"} color={'gray.200'}>
                You Voted:
            </Text>
            <Text color={'purple.200'}>{getExistingVote()[0].option}</Text> 
            </div>
        
        : undefined}
        <CardFooter
            hidden={getExistingVote() !== undefined && getExistingVote().length !== 0}
            justify='space-between'
            flexWrap='wrap'
            sx={{
            '& > button': {
                minW: '136px',
            },
            }}
        >
            <Button flex='1' onClick={() => {
                    const sel = {
                        "poll_id": poll.poll_id,
                        "option": poll.options[0]
                    };

                    castVote(bearer, sel.poll_id, sel.option).then( (response: any) => {
                        setVoteState(sel);
                        const updatedUserVotes = [...userVotes!, sel];
                        setUserVotes( updatedUserVotes );
                        console.log(userVotes!);
                    }).catch ((err: any) => {
                        console.error(err);
                    });
                }}>
                {poll.options[0]}
            </Button>
            &nbsp;&nbsp;
            <Button flex='1' onClick={() => {
                    const sel = {
                        "poll_id": poll.poll_id,
                        "option": poll.options[1]
                    };
                    castVote(bearer, sel.poll_id, sel.option).then( (response: any) => {
                        setVoteState(sel);
                        const updatedUserVotes = [...userVotes!, sel];
                        setUserVotes( updatedUserVotes );
                        console.log(userVotes!);
                    }).catch ((err: any) => {
                        console.error(err);
                    });
                }}>
                {poll.options[1]}
            </Button>
        </CardFooter>
    </Card>
    </Center>
    )
};

export default Ballot;