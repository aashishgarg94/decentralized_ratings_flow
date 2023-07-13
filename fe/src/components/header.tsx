import { Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";

import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

import {
  faTwitter,
  faDiscord,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  m_HeaderBgColor,
  m_NormalTextColor,
  m_SectionHeadingColor,
} from "../Constants";

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Flex
        bg={m_HeaderBgColor}
        color={"gray.200"}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}>
        <Flex
          flex={{ base: '0.2', md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} color={"gray.200"}/> : <HamburgerIcon w={5} h={5} color={"gray.200"}/>
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 0.8, sm: 1 }} justify={{ base: 'center', md: 'start' }} pb={1}>
          <Flex flex={{ base: 1, sm: 0.5 }} direction={{ base: "row", sm: "row"}} alignItems={"center"} px={5}>
           <Avatar size="md" name="Dece Rate" src="sockrates_logo.png" />
             <Text
              pt={0}
              px={0}
              fontSize={{ base: "3xl", sm: "3xl", md: "3xl" }}
              fontWeight="normal"
              fontFamily={"KoolBeans-eerm"}
              textColor={"gray.200"}
            >
              <Link to="/">
              Sock Rates
              </Link>
              <Badge ml="2" colorScheme="green">
                beta
              </Badge>
            </Text>
            {/* <Text fontSize="sm">UI Engineer</Text> */}
           </Flex>
          <Flex display={{ base: 'none', md: 'flex' }} flex={{base: 1, sm: 0.3}} ml={10} alignItems={"center"}>
            <DesktopNav />
          </Flex>
        </Flex>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
            <Link to={navItem.href} color={linkColor}>{navItem.label}</Link>
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={"gray.800"}
      p={4}
      display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={onToggle}>
      <Link to={href}><Text color={"gray.200"}>{label}</Text></Link>
    </Stack>
  );
};

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Rate & Stake',
    href: "/rate"
  },
  {
    label: 'Movies',
    href: "/category/movies"
  },
  {
    label: 'TV Shows',
    href: '/category/tv_shows'
  },
  {
    label: 'Web Content',
    href: '/category/web_content'
  }
];