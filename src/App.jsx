import "./App.css";
import {
  Spinner,
  Box,
  Text,
  AbsoluteCenter,
  VStack,
  Center,
  Grid,
  Button,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import {
  useConnect,
  useAccount,
  useTransaction,
  IntuTransactionModal,
  useAccountRecovery,
} from "@intuweb3/web-kit";
import { LoginButton } from "./components/Login";
import { getClaimStatusForNFTs } from "./components/Nft";
import NFTJSON from "./1155.json";
import { useNFT } from "./hooks/useNFT";
import { NFTGrid } from "./components/NFTGrid";
import { WelcomeBox } from "./components/WelcomeBox";
import { PageHeader } from "./components/PageHeader";
import { Transak } from "@transak/transak-sdk";

import {
  NFT_CONTRACT_ADDRESS_ARBITRUM_ONE,
  NFT_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA,
  NFT_CONTRACT_ADDRESS_XFI,
  NFT_CONTRACT_ADDRESS_ETHERLINK,
  IS_XFI,
  IS_MAINNET,
  IS_ETHERLINK,
  provider,
  erc1155Interface,
  getNetworkFromChainId,
} from "./config/constants";

const nftContractAddress = IS_XFI
  ? NFT_CONTRACT_ADDRESS_XFI
  : IS_ETHERLINK
  ? NFT_CONTRACT_ADDRESS_ETHERLINK
  : IS_MAINNET
  ? NFT_CONTRACT_ADDRESS_ARBITRUM_ONE
  : NFT_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA;
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
  //const {
  //  setAccountRecovery,
  //  isAccountRecoveryActive,
  //  proposeRecoveryWallet,
  //  preRegistrationUserRotation,
  //  getAllProposedRecoveryAddresses,
  //  getPendingRecoveryAddress,
  //  setAccountRecoveryCustomAuth,
  //} = useAccountRecovery();

  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
  const [currentVault, setCurrentVault] = useState("");
  const [currentVaultEoa, setCurrentVaultEoa] = useState("");
  const [intuVaults, setIntuVaults] = useState([]);
  const [gatheringVaults, setGatheringVaults] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [claimStatuses, setClaimStatuses] = useState([]);
  const [isTransakOpen, setIsTransakOpen] = useState(false);

  let sleeptime = IS_XFI ? 5500 : 1500;
  const databump = 1;
  const totalTokens = 44;

  const { nftData } = useNFT(provider);

  useEffect(() => {
    const initializeAccount = async () => {
      const currentBlock = await provider.getBlockNumber();
      if (intuVaults.length === 0) {
        console.log(userIntuInfo);
        setGatheringVaults(true);
        let vaultsData = null;
        console.log(provider);
        console.log(nftContractAddress);
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
          console.log("createintuaccount start");
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
            await sleep(sleeptime);
            vaultsData = await getIntuAccount();
            if (vaultsData) {
              setIntuVaults(vaultsData);
              setCurrentVault(vaultsData.vaultAddress);
              setCurrentVaultEoa(vaultsData.masterPublicAddress);
            }
          }
        }
      }
      setGatheringVaults(false);
    };
    if (isIntuConnected) {
      initializeAccount();
    }
  }, [isIntuConnected, userIntuInfo, currentIntuAccount]);

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
                Creating{" "}
                {IS_XFI ? "CrossFi" : IS_ETHERLINK ? "Etherlink" : "Web3"}{" "}
                account.
                <Text>
                  Please wait while we set up your account. This should take
                  about {IS_XFI ? "30" : "15"} seconds
                </Text>
              </Text>
              {IS_XFI ? (
                <video width="100%" autoPlay loop muted>
                  <source src="../CROSSFI_1.mp4" type="video/mp4" />
                </video>
              ) : IS_ETHERLINK ? (
                <img src="../tezos.gif" alt="Tezos loading" width="100%" />
              ) : (
                ""
              )}
            </>
          )}
          {isIntuConnected &&
            currentVaultEoa != "0x0000000000000000000000000000000000000000" && (
              <>
                <Text>
                  <a
                    target="_blank"
                    href={
                      IS_XFI
                        ? `https://test.xfiscan.com/address/${currentVaultEoa}`
                        : IS_ETHERLINK
                        ? `https://explorer.etherlink.com/address/${currentVaultEoa}`
                        : `https://explorer.arbitrum.io/address/${currentVaultEoa}`
                    }
                  >
                    {`${currentVaultEoa.slice(0, 6)}...${currentVaultEoa.slice(
                      -4
                    )}`}
                  </a>
                </Text>
                <br />
                <br />
                {!isCreatingIntuAccount &&
                  currentVaultEoa !=
                    "0x0000000000000000000000000000000000000000" && (
                    <Button
                      onClick={() => doTransak(currentVaultEoa)}
                      colorScheme="blue"
                      mt={4}
                    >
                      Buy Crypto
                    </Button>
                  )}
              </>
            )}
        </VStack>
      </Box>
    );
  };

  const doTransak = async (wallet) => {
    const transakConfig = {
      apiKey: "99a7a0e0-839b-41f7-8905-97db358b15f0", // (Required)
      environment: Transak.ENVIRONMENTS.STAGING,
      widgetType: "full-screen", // Use full-page overlay
      cryptoCurrency: "ETH", // Example cryptocurrency
      fiatCurrency: "USD", // Example fiat currency
      defaultFiatAmount: 20, // Default fiat amount
      walletAddress: wallet, // Replace with your wallet address
      themeColor: "#000000", // Customize theme color
      exchangeScreenTitle: IS_XFI
        ? "Get started with CROSSFI"
        : IS_ETHERLINK
        ? "Get started with ETHERLINK"
        : "Get started",
      defaultNetwork: IS_XFI ? "crossfi" : IS_ETHERLINK ? "tezos" : "ethereum",
      //hostURL: window.location.origin, // Current host URL
      //
      //https://docs.transak.com/docs/query-parameters
      //
    };

    const transak = new Transak(transakConfig);
    transak.init();

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log("Order Successful:", orderData);
      transak.close();
    });

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_FAILED, (errorData) => {
      console.error("Order Failed:", errorData);
      transak.close();
    });

    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      console.log("Transak Widget Closed");
      transak.close();
    });
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
          {!IS_XFI && !IS_ETHERLINK ? (
            <Button onClick={() => mmconnect()}>MM</Button>
          ) : (
            ""
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
                currentVault={currentVault}
                currentVaultEoa={currentVaultEoa}
                creatingAccount={creatingAccount}
                gatheringVaults={gatheringVaults}
                onSubmitTx={submitTx}
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
