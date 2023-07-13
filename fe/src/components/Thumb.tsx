import { Flex, Box, Text } from "@chakra-ui/react";
import * as React from 'react';

type Props = {
    value: number;
    thumbIndex: number;
    thumbProps: any;
    bgColor: string;
    // onKeyDownStepBy: {
    //     e: React.KeyboardEvent<HTMLDivElement>
    //     thumbIndex: number;
    // };
};

const Thumb = ({ value, bgColor, thumbIndex, thumbProps }: Props) => {
    return (
        <Box
            top='1%'
            boxSize={8}
            bgColor={bgColor}
            borderRadius='full'
            _focusVisible={{
                outline: 'none',
            }}
            // onKeyDown={(e) => onKeyDownStepBy(e, thumbIndex)}
            {...thumbProps}
        >
            <Flex w='100%' h='100%' alignItems='center' justifyContent='center'>
                <Text color='white'>{value}</Text>
            </Flex>
        </Box>
    );
};
export default Thumb;