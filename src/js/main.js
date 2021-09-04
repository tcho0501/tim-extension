import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Notes from "./components/Notes";
import { initialiseFirebase } from "./firebase";

const SidebarWrapper = styled.div`
  height: 100vh;
  position: fixed;
  width: 30vw;
  right: 0;
  top: 0;
  z-index: 9999;
  background-color: white;
  color: black;
  border-left: solid gray 1px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.span`
  position: relative;
  height: 70px;
  text-align: center;
  width: 100%;
  background-color: #3e3e56;
  color: #f8f8f8;
  font-size: 1.5rem;
  line-height: 70px;
`;

const Body = styled.div`
  flex-grow: 1;
  width: 100%;
  background-color: #f8f8f8;
`;

const Button = styled.button`
  position: fixed;
  top: 50vh;
  right: 0;
  background-color: #3e3e56;
  color: #f8f8f8;
  cursor: pointer;
  z-index: 9999;
  height: 40px;
  width: 40px;
  font-size: 1.5rem;
  border-radius: 5px 0 0 5px;
`;

const CloseIcon = styled.img`
  cursor: pointer;
  position: absolute;
  top: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
`;

const App = () => {
  const [showApp, setShowApp] = useState(false);
  const src = chrome.runtime.getURL(`icons/close.png`);
  const buttonText = "<";
  return showApp ? (
    <SidebarWrapper>
      <Header>
        <CloseIcon src={src} alt="close" onClick={() => setShowApp(false)} />
        Tim's Dashboard
      </Header>
      <Body>
        <Notes />
      </Body>
    </SidebarWrapper>
  ) : (
    <Button onClick={() => setShowApp(true)}> {buttonText} </Button>
  );
};

chrome.storage.local.get("timExtension", function (data) {
  if (data.timExtension === true) {
    console.log("this is true, inject app");
    injectApp();
  }
});

// Message Listener function
chrome.runtime.onMessage.addListener((request, sender, response) => {
  chrome.storage.local.set({ timExtension: true });
  if (request.injectApp) {
    injectApp();
    response({
      startedExtension: true,
    });
  }
});

function injectApp() {
  const newDiv = document.createElement("div");
  newDiv.setAttribute("id", "chromeExtensionReactApp");
  document.body.appendChild(newDiv);
  ReactDOM.render(<App />, newDiv);
}

initialiseFirebase();
