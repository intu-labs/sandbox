import "./App.css";
import {
  Spinner,
  Box,
  Text,
  AbsoluteCenter,
  VStack,
  Center,
  Grid,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import {
  useConnect,
  useAccount,
  useTransaction,
  IntuTransactionModal,
  useAccountRecovery,
} from "@intuweb3/steven-web-kit";
import { LoginButton } from "./components/Login";
import { getClaimStatusForNFTs } from "./components/Nft";
import NFTJSON from "./1155.json";
import { useNFT } from "./hooks/useNFT";
import { NFTGrid } from "./components/NFTGrid";
import { WelcomeBox } from "./components/WelcomeBox";
import { PageHeader } from "./components/PageHeader";

import {
  NFT_CONTRACT_ADDRESS_ARBITRUM,
  NFT_CONTRACT_ADDRESS_XFI,
  IS_XFI,
  provider,
  erc1155Interface,
} from "./config/constants";

const nftContractAddress = IS_XFI
  ? NFT_CONTRACT_ADDRESS_XFI
  : NFT_CONTRACT_ADDRESS_ARBITRUM;
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
  const { createIntuTransaction, handleApproveTransaction } = useTransaction();
  const {
    setAccountRecovery,
    isAccountRecoveryActive,
    proposeRecoveryWallet,
    preRegistrationUserRotation,
    getAllProposedRecoveryAddresses,
    getPendingRecoveryAddress,
    setAccountRecoveryCustomAuth,
  } = useAccountRecovery();

  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
  const [currentVault, setCurrentVault] = useState("");
  const [currentVaultEoa, setCurrentVaultEoa] = useState("");
  const [intuVaults, setIntuVaults] = useState([]);
  const [gatheringVaults, setGatheringVaults] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [claimStatuses, setClaimStatuses] = useState([]);

  let blockRange = 250000;
  let sleeptime = IS_XFI ? 5500 : 1500;
  const databump = 1;
  const totalTokens = 44;

  const { nftData } = useNFT();

  useEffect(() => {
    const initializeAccount = async () => {
      if (intuVaults.length === 0) {
        setGatheringVaults(true);
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
          intuAirdrop();
          await sleep(sleeptime);
          await createIntuAccount();
          console.log("done creating account");
          setCreatingAccount(false);
          if (IS_XFI) {
            await sleep(sleeptime);
            vaultsData = await getIntuAccount();
            if (vaultsData) {
              setIntuVaults(vaultsData);
              setCurrentVault(vaultsData.vaultAddress);
              setCurrentVaultEoa(vaultsData.masterPublicAddress);
            }
          } else {
            //window.location.reload();
            vaultsData = await getIntuAccount();
            if (vaultsData) {
              setIntuVaults(vaultsData);
              setCurrentVault(vaultsData.vaultAddress);
              setCurrentVaultEoa(vaultsData.masterPublicAddress);
            }
            //IS_XFI ? await sleep(sleeptime) : "";
          }
        }
      }
      setGatheringVaults(false);
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
      setClaimStatuses(nftClaimStatusArray);
    };
    fetchData();
  }, []);

  let submitTx = async (myVaultAddress, myCurrentVaultEoa, index) => {
    let to = nftContractAddress;

    await intuAirdropMasterAccount();
    //const data = erc721Interface.encodeFunctionData("safeMint", [
    //  myCurrentVaultEoa,
    //  index,
    //]);

    const data = erc1155Interface.encodeFunctionData("claimNFT", [index]);
    try {
      await createIntuTransaction({
        toAddress: to,
        amount: "0",
        data: data,
      });
      console.log("Transaction created successfully!");
    } catch (err) {
      console.log(err);
    }
    //let signTx = await signTx(myVaultAddress, 1);
  };

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
            intuConnect={connectIntu}
            isIntuConnected={isIntuConnected}
            intuDisconnect={disconnectIntu}
            isCreatingIntuAccount={isCreatingIntuAccount}
          />
          <Text fontWeight="bold">Info:</Text>
          {isCreatingIntuAccount && (
            <>
              <Text>
                Creating INTU MPC account.
                <Text>
                  Please wait while we set up your account. This should take
                  about 30 seconds
                </Text>
              </Text>
              <video width="100%" autoPlay loop muted>
                <source src="../CROSSFI_1.mp4" type="video/mp4" />
              </video>
            </>
          )}
          {isIntuConnected && (
            <>
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
              <br />
              <br />
            </>
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
            <WelcomeBox
              connectIntu={connectIntu}
              isIntuConnected={isIntuConnected}
              disconnectIntu={disconnectIntu}
              isCreatingIntuAccount={isCreatingIntuAccount}
            />
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
              <PageHeader />
              <NFTGrid
                nftData={nftData}
                currentVault={currentVault}
                currentVaultEoa={currentVaultEoa}
                creatingAccount={creatingAccount}
                gatheringVaults={gatheringVaults}
                onSubmitTx={submitTx}
                nftContract={nftContract}
              />
            </Grid>
          ) : (
            <>
              {isCreatingIntuAccount || gatheringVaults ? (
                <>
                  {/*
                  <Text color="white" size="xl">
                    Checking BlockChain ... <Spinner />
                  </Text>
                  */}
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
