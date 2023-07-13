import React from 'react'
import { RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb } from '@chakra-ui/react'

// import { Badge, Box, chakra, Flex, useRangeSlider } from "@chakra-ui/react";
// // import Actions from "./Actions";
// // import Instructions from "./Instructions";
// import Thumb from './Thumb';

const RangeSelector : React.FC<{selectionRange: number[], setSelectionRange: React.Dispatch<React.SetStateAction<number[]>>}> = ({selectionRange, setSelectionRange}) => {
    return (
    <RangeSlider aria-label={['min', 'max']} defaultValue={[selectionRange[0], selectionRange[1]]} onChange={([start, end]) => setSelectionRange([start, end])}>
        <RangeSliderTrack>
            <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} content={selectionRange[0].toString()}/>
        <RangeSliderThumb index={1} />
    </RangeSlider>
    )
}

export default RangeSelector


// type Props = {
//     min: number;
//     max: number;
//     stepToNumber: number;
//     stepToIndex: number;
//     stepByNumber: number;
//     defaultValue: [number, number];
//     'aria-label': [string, string];
//     setTempRange: React.Dispatch<React.SetStateAction<number[]>>
// };

// export default function RangeSelector({ min, max, stepToNumber, stepToIndex, stepByNumber, defaultValue, setTempRange, ...rest}: Props) {
//     const {
//         state,
//         actions,
//         getInnerTrackProps,
//         getInputProps,
//         getMarkerProps,
//         getRootProps,
//         getThumbProps,
//         getTrackProps,
//     } = useRangeSlider({min, max, defaultValue, ...rest})

//     setTempRange(defaultValue);
    

//     const { onKeyDown: onThumbKeyDownFirstIndex, ...thumbPropsFirstIndex } =
//         getThumbProps({
//             index: 0,
//         })

//     const { onKeyDown: onThumbKeyDownSecondIndex, ...thumbPropsSecondIndex } =
//         getThumbProps({
//             index: 1,
//         })

//     const markers = Array.from({ length: 3 }, (_, i) => i + 1).map((i) =>
//         getMarkerProps({ value: i * 25 })
//     );

//     // const onKeyDownStepBy = (e, thumbIndex) => {
//     //     if (e.code === 'ArrowRight') actions.stepUp(thumbIndex, stepByNumber)
//     //     else if (e.code === 'ArrowLeft')
//     //         actions.stepDown(thumbIndex, stepByNumber)
//     //     else
//     //         thumbIndex === 0
//     //         ? onThumbKeyDownFirstIndex(e)
//     //         : onThumbKeyDownSecondIndex(e)
//     // }
    
//     return (
//         <Box px={8} pt='2%'>
//             {/* <Flex flexDir='row' justifyContent='space-between'>
//                 <Instructions stepByNumber={stepByNumber}/>
//                 <Actions actions={actions} min={min} max={max} stepToIndex={stepToIndex} stepToNumber={stepToNumber} />
//             </Flex> */}
//             <chakra.div
//                 mt={2}
//                 cursor='pointer'
//                 w={{ base: '96%', lg: '98%' }}
//                 ml={{ base: '2%', lg: '1%' }}
//                 {...getRootProps()}
//             >
//                 <input {...getInputProps({ index: 0 })} hidden />
//                 <input {...getInputProps({ index: 1 })} hidden />
//                 {markers.map((markerProps, index) => {
//                     const value = String((index + 1) * 25) + '%'
//                     return (
//                         <Badge
//                             ml='-18px'
//                             mt='25px'
//                             fontSize='sm'
//                             color='black'
//                             {...markerProps}
//                         >
//                             {value}
//                         </Badge>
//                     )
//                 })}
//                 <Box
//                     h='7px'
//                     bgColor='teal.100'
//                     borderRadius='full'
//                     {...getTrackProps()}
//                 >
//                     <Box
//                         h='7px'
//                         bgColor='teal.500'
//                         borderRadius='full'
//                         {...getInnerTrackProps()}
//                     />
//                 </Box>
//                 <Thumb 
//                     value={state.value[0]} 
//                     thumbIndex={0} 
//                     thumbProps={thumbPropsFirstIndex} 
//                     bgColor='teal.500'
//                 />
//                 <Thumb 
//                     value={state.value[1]} 
//                     thumbIndex={1} 
//                     thumbProps={thumbPropsSecondIndex} 
//                     bgColor='teal.500'
//                 />
//             </chakra.div>
//         </Box>
//     );
// };