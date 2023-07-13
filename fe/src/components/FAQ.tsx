import {
    chakra,
    Flex,
    Container,
    Heading,
    Stack,
    Text,
    Button,
    Icon,
    IconProps,
    Box,
    SimpleGrid,
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

const FAQs = [
    {
        question: "What is Sockrates?",
        answer: "Sockrates is a decentralized ratings platform that solves the issue of manipulation and bias in ratings. It uses the power of blockchain to ensure that the polls are transparent, unbiased and secure. At the same time, it also rewards voters to incentivize them to vote more and more."
    },
    {
        question: "How does Sockrates ensure that no one is able to front run the poll results?",
        answer: "A blind voting platform is a platform that allows polls to take place with the current results kept hidden until the poll ends. Sockrates uses blind polls which means that the results of the poll are not revealed until the poll ends, and only encrypted votes can be seen before the reveal phase. This ensures that no one is able to front run the poll results."
    },
    {
        question: "How do I earn rewards while voting on Sockrates?",
        answer: "Voters on Sockrates earn by getting a part of the fees collected from the staking pool. The more you vote, the more you earn!"
    },
    {
        question: "How do I earn rewards while staking on Sockrates?",
        answer: "Stakers earn by predicting the outcome of the blind polls. The closer you are to the actual result, and the more you stake, the more you earn! Note that if you stake in wider range, your upside is limited, but if you stake in a narrow range, your upside and your risk is higher."
    }
]

export default function FAQ() {
    return (
    <Container maxW={'5xl'} p={2} mt={24}>
        <Heading
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '3xl', md: '3xl' }}
            color={'gray.200'}
            lineHeight={'110%'}>
            Frequently Asked Questions
        </Heading>
        <Accordion allowToggle pt={16} pb={28}>
            {FAQs.map((faq) => (
                <AccordionItem border={'0'}>
                    <h2>
                    <AccordionButton bgColor={'purple.800'} mt={5} p={3} rounded={5}>
                        <Box as="span" flex='1' textAlign='left'>
                            <Text ml={3} fontSize={{ base: 'xl', sm: 'xl', md: 'xl' }} color={'gray.200'}>{faq.question}</Text>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                    <Text textAlign={'left'} fontSize={{ base: 'xl', sm: 'xl', md: 'xl' }} color={'gray.400'}>
                        {faq.answer}
                    </Text>
                    </AccordionPanel>
                </AccordionItem>
            ))
            }
        </Accordion>
    </Container>
    );
  }