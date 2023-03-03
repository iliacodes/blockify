import React, { useEffect, useState } from "react";
import SpotifyPlayer from 'react-spotify-player';
import { ethers } from "ethers";
import './App.css';
import BlockifyPortal from "./utils/BlockifyPortal.json";

export default function App() {


  const [message, setMessage] = useState("");
  const [allRecommendations, setAllRecommendations] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x7dd81fF49550fD484aEE229cc76B84C68B1d185A";

  const checkWalletConnection = async () => {
    try {

      const { ethereum } = window;

      if (!ethereum) {
        alert("Where is your metamask anon?");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found authorized account:", account);
      } else {
        console.log("No authorized account found.");
      }

    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Where is your metamask anon?");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });


      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const recommend = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const blockifyPortalContract = new ethers.Contract(contractAddress, BlockifyPortal.abi, signer);

        let count = await blockifyPortalContract.getTotalRecommendations();
        console.log("Retrieved total.", count.toNumber());

        const blockifyTxn = await blockifyPortalContract.recommend(message, {
          gasLimit: 250000,
        });

        console.log("Mining...", blockifyTxn.hash);
        await blockifyTxn.wait();
        console.log("Mined", blockifyTxn.hash);

        count = await blockifyPortalContract.getTotalRecommendations();
        console.log("Retrieved total.", count.toNumber());

      } else {
        console.log("Ethereum Object not found.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllRecommendations = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const blockifyPortalContract = new ethers.Contract(contractAddress, BlockifyPortal.abi, signer);

        const recommendations = await blockifyPortalContract.getAllRecommendations();

        const recommendationsCleaned = recommendations.map((recommendation) => {
          return {
            address: recommendation.recommender,
            timestamp: new Date(recommendation.timestamp * 1000),
            message: recommendation.message
          };
        });

        setAllRecommendations(recommendationsCleaned);

      } else {
        console.log("Ethereum Object not found.");
      };

    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    getAllRecommendations();
    checkWalletConnection();
  }, []);

  useEffect(() => {
    let blockifyPortalContract;

    const onNewRecommendation = (from, timestamp, message) => {
      console.log("newRecommendation", from, timestamp, message);
      setAllRecommendations((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      blockifyPortalContract = new ethers.Contract(contractAddress, BlockifyPortal.abi, signer);

      blockifyPortalContract.on("NewRecommendation", onNewRecommendation);
    }
    return () => {
      if (blockifyPortalContract) {
        blockifyPortalContract.off("NewRecommendation", onNewRecommendation);
      }
    };
  }, []);


  return (
    <div className="App">
      <div className="mainContainer">

        <div className="dataContainer">
          <div className="header">
            Hey Anon!
          </div>

          <div className="bio">
            Any Dark-Techno songs, artists, or playlists?! Post them on the blockchain for the community. The more chaotic the better.

            <br></br>
            <br></br>


            <strong>Please only provide valid links.</strong>
          </div>
          <br></br>

          <input
            className="waveMessage"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Unsk Usnk Unsk..."
          />

          <button className="waveButton" onClick={() => recommend(message)} >
            Recommend.
          </button>
          {!currentAccount && (
            <button className="connect-wallet-container" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}

          {allRecommendations.map((recommender, index) => {
            return (
              <div
                key={index}
                style={{
                  backgroundColor: "rgba(142, 222, 135, 0.5)",
                  marginTop: "16px",
                  padding: "8px",
                  borderRadius: "5px",
                }}
              >
                {recommender.message && (
                  <div>
                    <iframe
                      style={{ borderRadius: '12px' }}
                      src={`https://open.spotify.com/embed?uri=${encodeURIComponent(recommender.message)}`}
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    ></iframe>
                    <div>Recommended by Address: {recommender.address}</div>
                    <br></br>
                    <div>Time: {recommender.timestamp.toString()}</div>
                    <br></br>
                    <div>Spotify Link: {recommender.message}</div>

                    {console.log(typeof recommender.message)}
                  </div>
                )}
              </div>
            );
          })}


        </div>
      </div>
    </div>
  );
}
