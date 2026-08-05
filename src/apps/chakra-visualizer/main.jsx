// @ts-nocheck
/* eslint-disable */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LanguageProvider } from "./LanguageContext";
import { GameProvider } from "./GameContext";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <LanguageProvider>
        <GameProvider>
            <App />
        </GameProvider>
    </LanguageProvider>
);
