import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, Image, Box, Progress, Stack, 
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    Editable, EditablePreview, EditableInput
    } from '@chakra-ui/react'
import {Poll} from '../models/Poll'
import { start } from "repl";
import RangeSelector from './RangeSelector'

const SinglePoll: React.FC<{poll: Poll}> = ({poll}) => {
    let start_time = new Date(poll.start_time);
    let end_time = new Date(poll.end_time);
    let curr_time = new Date();

    let total_time = (end_time.valueOf() - start_time.valueOf());
    let elapsed_time = (curr_time.valueOf() - start_time.valueOf());
    let time_remaining = (end_time.valueOf() - curr_time.valueOf());
    let pct_time_passed = 100 * elapsed_time / total_time;

    let millisecondsToStr = (milliseconds: number) => {
        // TIP: to find current time in milliseconds, use:
        // var  current_time_milliseconds = new Date().getTime();
    
        let numberEnding = (number: number) => {
            return (number > 1) ? 's' : '';
        };
    
        var temp = Math.floor(milliseconds / 1000);
        var years = Math.floor(temp / 31536000);
        if (years) {
            return years + ' year' + numberEnding(years);
        }
        //TODO: Months! Maybe weeks? 
        var days = Math.floor((temp %= 31536000) / 86400);
        if (days) {
            return days + ' day' + numberEnding(days);
        }
        var hours = Math.floor((temp %= 86400) / 3600);
        if (hours) {
            return hours + ' hour' + numberEnding(hours);
        }
        var minutes = Math.floor((temp %= 3600) / 60);
        if (minutes) {
            return minutes + ' minute' + numberEnding(minutes);
        }
        var seconds = temp % 60;
        if (seconds) {
            return seconds + ' second' + numberEnding(seconds);
        }
        return 'less than a second'; //'just now' //or other string you like;
    };

    return (
    <Card>
        <CardHeader>
            <Heading size='md'> {poll.title} </Heading>
        </CardHeader>
        <CardBody>
            <Box overflow='hidden' justifyContent='center' display={'flex'} alignItems='center'>
            <Image src={poll.img_src} alt='Elections' filter='auto' saturate='60%' width={'200px'}/>
            </Box>
            <Text> {poll.description} </Text>
        </CardBody>
        <CardFooter
            justify='space-between'
            flexWrap='wrap'
            sx={{
            '& > button': {
                minW: '136px',
            },
            }}
        >
            <Button flex='1'>
                {poll.option1}
            </Button>
            <Button flex='1'>
                {poll.option2}
            </Button>
        </CardFooter>
        <Stack direction={'column'} spacing={2}>
            <Text flex='1' >
                Voting Ends on: {poll.end_time}
            </Text>
            
            <Text flex='1' >
                {millisecondsToStr(time_remaining)} left
            </Text>
        </Stack>

        <Text flex='1'>
            What percentage of people would have voted yes in this poll?
        </Text>

        {/* <RangeSelector min={0} max={100} stepToNumber={85} stepToIndex={1} stepByNumber={10} defaultValue={[40, 60]} aria-label={['min', 'max']}/> */}

        <Stack direction='row' pt={10} justifyContent={'center'} textAlign={'center'}>
            <Editable flex={1} defaultValue='Enter staking amount'>
                <EditablePreview />
                <EditableInput />
            </Editable>
            <Text flex={1} textAlign={'center'}>
                You could win $100
            </Text>
        </Stack>

        {/* <RangeSlider defaultValue={[40, 60]} min={0} max={100} step={5}>
        <RangeSliderTrack bg='red.100'>
            <RangeSliderFilledTrack bg='tomato' />
        </RangeSliderTrack>
        <RangeSliderThumb boxSize={6} index={0} />
        <RangeSliderThumb boxSize={6} index={1} />
        </RangeSlider> */}
    </Card>
    )
};

export default SinglePoll;