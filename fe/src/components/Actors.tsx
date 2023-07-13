import {
    Container,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Text

} from "@chakra-ui/react";

const actors = [
    {
        "title": "I want to vote",
        "description": "Great! We incentivize our voters to participate in the polls to bring a better consensus. You can vote on multiple movies at the same time. The more you vote, the more you earn!",
        "steps": ["Step 1: Connect your wallet", "Step 2: Select the movie you want to vote on", "Step 3: Click on 'Vote' on the movie card", "Step 4: Select Yes or No", "Step 5: Earn rewards!"]
    },
    {
        "title": "I want to stake",
        "description": "Great! Estimate what the outcome of the poll will be and stake on it. The closer you are to the actual result, the more you earn!",
        "steps": ["Step 1: Connect your wallet", "Step 2: Select the movie you want to stake on", "Step 3: Click on 'Stake' on the movie card", "Step 4: Select a range for your prediction", "Step 5: Stake the amount of USD you want", "Step 6: Earn rewards!"]
    }
]

export default function Actors() {
    return (
      <Container maxW={"5xl"} p={2} pt={{base: 16, sm: 32}} pb={{ base: 10, sm: 20 }} textAlign={"left"}>
        <Tabs variant="enclosed" borderBottom={"1px"} borderColor={"gray.700"}>
        <TabList>
            {actors.map((actor) => (
                <Tab border={"1px"} color={"gray.50"} px={{base: 5, sm: 20}} fontSize={{ base: "xl", sm: "xl", md: "xl" }} fontWeight={"semibold"} _selected={{ color: 'black', bg: "purple.400"}}>
                    <h3>{actor.title}</h3>
                </Tab>
            ))}
        </TabList>

        <TabPanels py={5}>
            {actors.map((actor) => (
                <TabPanel color={"gray.400"}>
                    <p>
                        {actor.description}
                        <br/><br/>
                        {actor.steps.map((step) => (
                            <Text color={"gray.400"}>{step}</Text>
                        ))}
                    </p>
                </TabPanel>
            ))}
        </TabPanels>
        </Tabs>
      </Container>
    );
  }
  