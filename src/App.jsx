import "./App.css";
import {
  Spinner,
  Box,
  Text,
  AbsoluteCenter,
  Button,
  Heading,
  VStack,
  Center,
  SimpleGrid,
  Image,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

import {
  useConnect,
  useAccount,
  useTransaction,
  IntuTransactionModal,
} from "@intuweb3/steven-web-kit";

import { RotatingText } from "./helpers/RotatingText";
import { LoginButton } from "./helpers/Login";
import { getClaimStatusForNFTs } from "./helpers/Nft";
import NFTJSON from "./721.json";

const provider = new ethers.providers.StaticJsonRpcProvider(
  `https://arbitrum-sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_RPC}`
);
const erc721Interface = new ethers.utils.Interface([
  "function safeMint(address _to, uint _tokenId)",
]);

const nftContractAddress = "0x713b3c01dfb2a3edefc3002d24aae09cc321f89e";
const nftContractABI = NFTJSON;
const nftContract = new ethers.Contract(
  nftContractAddress,
  nftContractABI,
  provider
);
function App() {
  const { connectIntu, isIntuConnected, disconnectIntu, userIntuInfo } =
    useConnect();
  const {
    isCreatingIntuAccount,
    currentIntuAccount,
    intuAirdrop,
    intuAirdropMasterAccount,
    createIntuAccount,
    getIntuAccount,
  } = useAccount();
  const { createIntuTransaction } = useTransaction();
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
  const [currentVault, setCurrentVault] = useState("");
  const [currentVaultEoa, setCurrentVaultEoa] = useState("");
  const [intuVaults, setIntuVaults] = useState([]);
  const [gatheringVaults, setGatheringVaults] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [claimStatuses, setClaimStatuses] = useState([]);

  let sleeptime = 1250;
  const databump = 1;
  const totalTokens = 44;

  useEffect(() => {
    const initializeAccount = async () => {
      if (intuVaults.length === 0) {
        setGatheringVaults(true);
        await sleep(500);
        let vaultsData = null;

        if (userIntuInfo) {
          vaultsData = await getIntuAccount();
        }

        if (vaultsData) {
          setIntuVaults(vaultsData);
          setCurrentVault(vaultsData.vaultAddress);
          setCurrentVaultEoa(vaultsData.masterPublicAddress);
        } else {
          setCreatingAccount(true);
          await sleep(sleeptime);
          await intuAirdrop();
          await sleep(sleeptime);
          await createIntuAccount();
          setCreatingAccount(false);
          window.location.reload();
        }
        setGatheringVaults(false);
      }
    };
    if (isIntuConnected) {
      initializeAccount();
    }
  }, [isIntuConnected, userIntuInfo, currentIntuAccount]);

  useEffect(() => {
    const fetchData = async () => {
      let nftClaimStatusArray = await getClaimStatusForNFTs(
        nftContract,
        totalTokens
      );
      nftClaimStatusArray.shift();
      setClaimStatuses(nftClaimStatusArray);
    };
    fetchData();
  }, []);

  let submitTx = async (myVaultAddress, myCurrentVaultEoa, index) => {
    //let chainId = "421614";
    //let value = "0";
    let to = nftContractAddress;
    //let gasPrice = 100000;
    //let gas = 100000;
    //let nonce = await provider.getTransactionCount(myCurrentVaultEoa);
    await intuAirdropMasterAccount();
    const data = erc721Interface.encodeFunctionData("safeMint", [
      myCurrentVaultEoa,
      index,
    ]);
    try {
      await createIntuTransaction({
        toAddress: to,
        amount: "0",
        data: data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const data = Array(totalTokens)
    .fill()
    .map((_, i) => ({
      image: `https://tan-legislative-peafowl-782.mypinata.cloud/ipfs/QmQEWNsT93yZWK5GqZQpDavVYf3Bw14hbgGuXzvxtwosfx/${
        i + databump
      }.png`,
      name: `Item ${i + databump}`,
      date: new Date(
        Date.now() - Math.floor(Math.random() * 1000000000)
      ).toLocaleDateString(),
      claimed: claimStatuses[i],
    }));

  const FloatingInfoBox = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;
    return (
      <Box
        position="fixed"
        top="20px"
        right="20px"
        bg="blue.50"
        boxShadow="xl"
        borderRadius="md"
        p={4}
        maxWidth="300px"
        zIndex={999}
        //bgColor="#d439c7"
        bgGradient="linear(to-br, gray.100, gray.400)"
        borderColor="gray.300"
      >
        <VStack align="start" spacing={2}>
          <LoginButton
            connectIntu={connectIntu}
            isIntuConnected={isIntuConnected}
            disconnectIntu={disconnectIntu}
            isCreatingIntuAccount={isCreatingIntuAccount}
          />
          <Text fontWeight="bold">Info:</Text>
          {isCreatingIntuAccount && (
            <Text>
              Creating INTU account.
              <br />
              Generating your address
            </Text>
          )}
          {getIntuAccount && (
            <Text>
              <a
                target="_blank"
                href={`https://sepolia.arbiscan.io/address/${currentVaultEoa}`}
              >
                {`${currentVaultEoa.slice(0, 6)}...${currentVaultEoa.slice(
                  -4
                )}`}
              </a>
            </Text>
          )}
        </VStack>
      </Box>
    );
  };

  return (
    <Box
      className="App"
      minHeight="100vh"
      width="100%"
      bgImage="url('../Space_Desktop_3.jpg')"
      bgPosition="center"
      bgRepeat="repeat-y"
      bgSize="cover"
    >
      <IntuTransactionModal />

      <div style={{ float: "right", padding: "10px" }}>
        {isCreatingIntuAccount || gatheringVaults ? <Spinner /> : ""}
      </div>
      <Center>
        <AbsoluteCenter>
          {!isIntuConnected ? (
            <Box
              bg="rgba(200, 200, 200, 0.7)"
              backdropFilter="blur(20px)"
              borderRadius="md"
              p={6}
              boxShadow="md"
            >
              <RotatingText />
              <br />
              <Text color="black" fontSize="xl">
                No wallet/gas/Web3-ness needed.
              </Text>
              <LoginButton
                connectIntu={connectIntu}
                isIntuConnected={isIntuConnected}
                disconnectIntu={disconnectIntu}
                isCreatingIntuAccount={isCreatingIntuAccount}
              />
            </Box>
          ) : (
            <> </>
          )}
        </AbsoluteCenter>
        <>
          {isIntuConnected ? (
            <Grid templateRows="auto 1fr" gap={0}>
              <FloatingInfoBox
                isIntuConnected={isIntuConnected}
                getIntuAccount={getIntuAccount}
              />
              <GridItem>
                <Box backdropFilter="blur(10px)" bg="rgba(1, 1, 1, 0.4)">
                  <Heading as="h1" size="xl" color="white">
                    <br />
                    Get started with Web3! Claim an NFT! 🚀
                  </Heading>
                </Box>
              </GridItem>
              <GridItem>
                <SimpleGrid
                  columns={[1, 2, 3, 4]}
                  spacing={6}
                  px={4}
                  backdropFilter="blur(10px)"
                  bg="rgba(1, 1, 1, 0.4)"
                  padding="50px;"
                >
                  {data.map((item, index) => (
                    <Box
                      key={index}
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      backdropFilter="blur(20px)"
                      bg="rgba(255, 255, 255, 0.7)"
                      isDisabled={item.claimed}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        objectFit="cover"
                        height="200px"
                        width="100%"
                      />
                      <VStack p={4} align="start">
                        <Text fontWeight="bold">NFT #{index + databump}</Text>
                        <Text fontSize="sm" color="gray.500">
                          Created: {item.date}
                        </Text>
                        {!creatingAccount ? (
                          <Button
                            isDisabled={item.claimed}
                            bg={item.claimed ? "red.300" : "blue.300"}
                            color={"white"}
                            onClick={() =>
                              submitTx(
                                currentVault,
                                currentVaultEoa,
                                index + databump
                              )
                            }
                          >
                            {!item.claimed ? "CLAIM NFT" : "Claimed"}
                          </Button>
                        ) : (
                          <Button isDisabled={true} isLoading={true}>
                            .Creating Account.
                          </Button>
                        )}
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </GridItem>
            </Grid>
          ) : (
            <>
              {isCreatingIntuAccount || gatheringVaults ? (
                <>
                  <Text color="white" size="xl">
                    Checking BlockChain ... <Spinner />
                  </Text>
                  <br />
                  <br />
                  <Spinner />
                </>
              ) : (
                ""
              )}
            </>
          )}
        </>
      </Center>
    </Box>
  );
}
export default App;
