import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Snowfall from 'react-snowfall'
import background from './images/newBg.jpg'
import logo from './images/logo.png'
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import { styled as styledM } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const normalWhitelist = require('./normalWhitelist.json');
const premiumWhitelist = require('./premiumWhitelist.json');

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

  const BootstrapInput = styledM(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #8a0000',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#8a0000',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }));

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #fff;
  padding: 10px;
  font-weight: bold;
  font-size: 18px;
  color: #c30f16;
  width: 150px;
  height: 50px;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }

  &:hover{
    transform: scale(1.1);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    color: #fb513f;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: #c10f16;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  @media (min-width: 767px) {
    flex-direction: row;
    width: 600px;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: #fff;
  text-decoration: none;

  &:hover{
    cursor: pointer;
    color: #000;
    transition: all 0.2s ease-in-out;
  }
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(0);
  const [maxMintAmount, setMaxMintAmount] = useState(0);
  const [role, setRole] = useState(0);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const handleChange = (event) => {
    setRole(event.target.value);
    setMintAmount(0);

    if (event.target.value == 1 || event.target.value == 2){
      setMaxMintAmount(3);
    }
    else if (event.target.value == 3){
      setMaxMintAmount(4);
    }
    else{
      setMaxMintAmount(0);
    }
  };

  const rolesArray = [
    {
      value: '0',
      label: 'Select Your Role!',
    },
    {
      value: '1',
      label: 'Santas Nice List',
    },
    {
      value: '2',
      label: 'Honorable Elf',
    },
    {
      value: '3',
      label: 'Legendary Elf',
    },
  ];

  const claimNFTs = () => {

    if (mintAmount <= 0){
      return
    }

    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);

    if (role == 1 || role == 2){
      const leafNodes1 = normalWhitelist.map(addr => keccak256(addr));
      const tree1 = new MerkleTree(leafNodes1, keccak256, { sortPairs: true});  
      const claimingAccount1 = keccak256(blockchain.account);
      const proof1 = tree1.getHexProof(claimingAccount1);

    //Send message to blockchain
    blockchain.smartContract.methods
    .preSale(blockchain.account, mintAmount, proof1)
    .send({
      //gasLimit: String(totalGasLimit),
      to: CONFIG.CONTRACT_ADDRESS,
      from: blockchain.account,
      value: totalCostWei,
    })
    .once("error", (err) => {
      console.log(err);
      setFeedback("Sorry, something went wrong please try again later.");
      setClaimingNft(false);
    })
    .then((receipt) => {
      console.log(receipt);
      setFeedback(
        `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
      );
      setClaimingNft(false);
      dispatch(fetchData(blockchain.account));
    });
    }
    else{
      const leafNodes2 = premiumWhitelist.map(addr => keccak256(addr));
      const tree2 = new MerkleTree(leafNodes2, keccak256, { sortPairs: true});  
      const claimingAccount2 = keccak256(blockchain.account);
      const proof2 = tree2.getHexProof(claimingAccount2);

      //Send message to blockchain
    blockchain.smartContract.methods
    .preSale(blockchain.account, mintAmount, proof2)
    .send({
      //gasLimit: String(totalGasLimit),
      to: CONFIG.CONTRACT_ADDRESS,
      from: blockchain.account,
      value: totalCostWei,
    })
    .once("error", (err) => {
      console.log(err);
      setFeedback("Sorry, something went wrong please try again later.");
      setClaimingNft(false);
    })
    .then((receipt) => {
      console.log(receipt);
      setFeedback(
        `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
      );
      setClaimingNft(false);
      dispatch(fetchData(blockchain.account));
    });
    }
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 0) {
      newMintAmount = 0;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > maxMintAmount) {
      newMintAmount = maxMintAmount;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  },);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <Snowfall />
      <s.Container
        flex={1}
        ai={"center"}
        style={{ backgroundColor: "var(--primary)", backgroundBlendMode: 'darken'}}
        image={background}
      >
        <s.SpacerMedium />
        <StyledLogo alt={"logo"} src={logo} />
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundImage: "linear-gradient(to bottom, #c30f16, #8a0000)",
              padding: 24,
              borderRadius: 24,
              border: "4px solid #fff ",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 64,
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              PRE-SALE
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 48,
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "#fff",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                Contract address: {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)", marginTop: '40px' }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"} style={{marginTop: '40px'}}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                  <s.Container ai={"center"} jc={"center"} fd={"row"} style={{marginTop: '20px'}}>
                  <FormControl sx={{ m: 1, width: 120 }} variant="standard">
                  <InputLabel sx={{color: '#fff'}} variant="standard" color="primary">Role</InputLabel>
                  <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={role}
                  label="Role"
                  onChange={handleChange}
                  input={<BootstrapInput />}>
                    {rolesArray.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </Select>
                  </FormControl>
                  </s.Container>
                  <s.Container ai={"center"} jc={"center"} fd={"row"} style={{marginTop: '50px'}} >
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                          fontSize: '24px'
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerMedium />
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                        marginTop: '20px'
                      }}
                    >
                      {feedback}
                    </s.TextDescription>          
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>
                    <s.Container ai={"center"} jc={"center"} fd={"row"} style={{marginTop: '50px'}}>
                    <s.TextTitle
                      style={{
                      textAlign: "center",
                      fontSize: 14,
                      color: "#fff",
                      }}
                      >
                      **ONLY LEGENDARY ELVES CAN MINT 4 NFTS**
                    </s.TextTitle>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "100%", backgroundColor: 'rgba(255,255,255,0.8)' }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "#880000",
              paddingTop: '10px',
              width: '70%'
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "#880000",
              paddingBottom: '10px',
              paddingTop: '10px',
              width: '70%'
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
