import React, { FC, ReactNode, useMemo, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import Nav from "./components/header";
import * as fcl from "@onflow/fcl";
import { LoginInput } from "./models/LoginInput";
import { Button } from "@chakra-ui/react";

import {
  login
} from "./api/api";

import Category from "./components/Category";
import Landing from "./components/Landing";
import Rate from "./components/Rate";

require("./App.css");

fcl.config({
  "accessNode.api": "https://access-testnet.onflow.org", // Endpoint set to Testnet
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Endpoint set to Testnet
})


const App: FC = () => {
  return (
  <Content />
  );
};
export default App;

const Content: FC = () => {
  const [guestBearer, setGuestBearer] = useState("");
  const [bearer, setBearer] = useState("");
  const [publicKey, setPublicKey] = useState<any>();
  console.log("publicKey", publicKey);

  const loginWallet = () => {
    fcl.authenticate();
    fcl.currentUser().subscribe((user: any) => user ? setPublicKey(user.addr) : setPublicKey(undefined));
  }

  const loginInput: LoginInput = {
    username: "test",
    password: "test",
  };

  useEffect(() => {
    login(loginInput)
      .then((response: any) => {
        setGuestBearer(response.data.access_token);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (!publicKey) {
      return;
    }

    const loginData = {
      username: publicKey,
      password: "test",
    };

    login(loginData)
      .then((response: any) => {
        setBearer(response.data.access_token);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, [publicKey]);



  return (
    <div className="App">
      <Router>
        <Nav></Nav>
        {!publicKey ?
          <Button onClick={() => loginWallet()} colorScheme="purple">Login</Button>
          : null
        }
          <Routes>
            <Route path="/" element={<Landing bearer={bearer} guestBearer={guestBearer} publicKey={publicKey}/>} />
            <Route path="/category/:category_name" element={<Category bearer={bearer} guestBearer={guestBearer} publicKey={publicKey}/>} />
            <Route path="/rate" element={<Rate bearer={bearer} guestBearer={guestBearer} publicKey={publicKey}/>} />
          </Routes>
        </Router>
    </div>
  );
};