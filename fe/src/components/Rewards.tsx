import {
    Button,
    Container,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useBreakpointValue,
  } from '@chakra-ui/react';
  
  export default function Rewards() {
    return (
    <Container maxW={"5xl"} p={2} textAlign={"left"}>
        <Stack direction={{ base: 'column', md: 'row' }} pt={{base: 0, sm: 20}} align={"center"}>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
            <Stack spacing={6} w={'full'} maxW={'lg'}>
                <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                <Text color={'purple.400'} as={'span'}>
                    Rewards for Voters
                </Text>{' '}
                </Heading>
                <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
                Voters on Sockrates earn by getting a part of the fees collected from the staking pool. The more you vote, the more you earn!
                </Text>
            </Stack>
            </Flex>
            <Flex flex={1} maxH={100}>
            <Image
                alt={'Login Image'}
                objectFit={"contain"}
                src={
                './voter_rewards.png'
                }
            />
            </Flex>
        </Stack>
        <Stack direction={{ base: 'column', md: 'row' }} pt={20}>
        <Flex flex={1}>
            <Image
                alt={'Login Image'}
                objectFit={"contain"}
                src={
                './staker_rewards.png'
                }
            />
            </Flex>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
            <Stack spacing={6} w={'full'} maxW={'lg'}>
                <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                <Text color={'purple.400'} as={'span'}>
                    Rewards for Stakers
                </Text>{' '}
                </Heading>
                <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
                Stakers earn by predicting the outcome of the blind polls. The closer you are to the actual result, and the more you stake, the more you earn!
                </Text>
            </Stack>
            </Flex>
        </Stack>
      </Container>
    );
  }