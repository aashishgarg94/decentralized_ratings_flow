import React from "react";
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
  Stack,
  List,
  ListItem,
  Flex,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { UserTxnCreateBaseModel } from "../models/UserTxnCreateBaseModel";

import { ToastContainer, toast } from "react-toastify";
import { userInfo } from "os";
import { m_CardHeadingColor, m_SectionHeadingColor } from "../Constants";

const PollCard: React.FC<{
  userTxn: UserTxnCreateBaseModel;
}> = ({ userTxn }) => {
  const notifyFailure = () => {
    toast.error("Could not fetch your previous votes or stakes!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const color = useColorModeValue("white", "gray.800");
  const fontSize = useBreakpointValue({ base: "sm", md: "sm", lg: "md" });
  const titleFontSize = useBreakpointValue({ base: "lg", md: "md", lg: "lg" });
  const alignResult = useBreakpointValue({
    base: "left",
    md: "center",
    lg: "center",
  });

  return (
    <div>
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
      <List borderBottom="1px" borderColor="gray.200">
        <ListItem
          p={5}
          border="1px"
          borderBottom="0px"
          borderColor="gray.200"
          borderRadius="0"
        >
          <Flex
            direction={{ base: "column", sm: "row" }}
            alignItems={alignResult}
          >
            <Box width={{ base: "100%", sm: "60%" }}>
              <Text
                fontSize={titleFontSize}
                fontWeight="bold"
                color={m_SectionHeadingColor}
                pb={2}
              >
                {userTxn.poll_title}
              </Text>
              {userTxn.end_date ? (
                <div>
                  <Text fontSize={fontSize} color={m_CardHeadingColor}>
                    Poll Expiry: {new Date(userTxn.end_date + "Z").toString()}
                  </Text>
                  {/* <Text fontSize={fontSize} color={"gray.200"} pb={2}>{userTxn.end_date}</Text> */}
                </div>
              ) : null}
              {userTxn.vote ? (
                <Text fontSize={fontSize} color={m_CardHeadingColor}>
                  Your Vote: {userTxn.vote}
                </Text>
              ) : null}
              {userTxn.range_begin ? (
                <Text fontSize={fontSize} color={m_CardHeadingColor}>
                  Staking Range Begin: {userTxn.range_begin}%
                </Text>
              ) : null}
              {userTxn.range_end ? (
                <Text fontSize={fontSize} color={m_CardHeadingColor}>
                  Staking Range End: {userTxn.range_end}%
                </Text>
              ) : null}
              {userTxn.tokens_staked ? (
                <Text fontSize={fontSize} color={m_CardHeadingColor}>
                  USD Staked: {userTxn.tokens_staked}
                </Text>
              ) : null}
            </Box>
            <Box width={{ base: "100%", sm: "20%" }}>
              {userTxn.result ? (
                <div>
                  <Text
                    fontSize={fontSize}
                    color={m_CardHeadingColor}
                    textAlign={{ base: "left", sm: "center" }}
                    pb={2}
                    pt={{ base: 2, sm: 0 }}
                  >
                    Vote Result
                  </Text>
                  <Text
                    fontSize={fontSize}
                    color={m_CardHeadingColor}
                    fontWeight="bold"
                    textAlign={{ base: "left", sm: "center" }}
                    pb={2}
                  >
                    {userTxn.result}
                  </Text>
                </div>
              ) : (
                <div>
                  <Text
                    fontSize={fontSize}
                    color={m_SectionHeadingColor}
                    textAlign={{ base: "left", sm: "center" }}
                    pb={2}
                    pt={{ base: 2, sm: 0 }}
                    fontWeight={"600"}
                  >
                    Vote Result
                  </Text>
                  <Text
                    fontSize={fontSize}
                    color={m_CardHeadingColor}
                    fontWeight="bold"
                    textAlign={{ base: "left", sm: "center" }}
                    pb={2}
                  >
                    Not Declared
                  </Text>
                </div>
              )}
            </Box>
            <Box width={{ base: "100%", sm: "20%" }}>
              {userTxn.reward ? (
                <Box>
                  <Text
                    fontSize={fontSize}
                    color={m_SectionHeadingColor}
                    textAlign={{ base: "left", sm: "center" }}
                    fontWeight={"600"}
                    pb={2}
                  >
                    Staking Reward
                  </Text>
                  <Text
                    fontSize={fontSize}
                    color={m_CardHeadingColor}
                    fontWeight="bold"
                    textAlign={{ base: "left", sm: "center" }}
                    pb={2}
                  >
                    {userTxn.reward}
                  </Text>
                </Box>
              ) : (
                <div>
                  <Text
                    fontSize={fontSize}
                    color={m_SectionHeadingColor}
                    textAlign={{ base: "left", sm: "center" }}
                    pb={2}
                    fontWeight={"600"}
                  >
                    Staking Reward
                  </Text>
                  <Text
                    fontSize={fontSize}
                    color={m_CardHeadingColor}
                    fontWeight="bold"
                    textAlign={{ base: "left", sm: "center" }}
                    pb={2}
                  >
                    Not Declared
                  </Text>
                </div>
              )}
            </Box>
          </Flex>
        </ListItem>
      </List>
    </div>
  );
};

export default PollCard;
