import React, { useEffect, useState } from "react";
import cetysMacot from "../imgs/cetysMascot.png";
import { FaMicrophone } from "react-icons/fa";
import useSpeechRecognition from "../hooks/useSpeechRecognitionHook";

function Home() {
  const actualUrl = "http://localhost:4000";

  const {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  const [textArea, setTextArea] = useState(false);

  const [textVal, setTextVal] = useState("");

  useEffect(() => {
    setTextVal(text);
    if (text != "") {
      handleOpenAi();
    }
  }, [text]);

  const handleOpenAi = async () => {
    console.log("fetching open ai endpoint...");

    try {
      const bodyText = {
        text: text,
      };

      const response = await fetch(`${actualUrl}/chat`, {
        method: "POST",
        body: JSON.stringify(bodyText),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      setTextVal(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen bg-yellow-500 w-full">
      <div className="h-[65%] flex justify-center items-center">
        <div className="h-2/3 flex justify-center items-center">
          <div
            onClick={() => {
              stopListening();
            }}
            className={
              !isListening
                ? "absolute w-0 h-0 smooth flex justify-center items-center"
                : "smooth rounded-full h-[17rem] w-[17rem] flex justify-center items-center absolute bg-green-700 shadow-2xl hover:cursor-pointer hover:scale-110"
            }
          >
            <FaMicrophone
              className={
                !isListening ? "text-[0] smooth" : "text-9xl smooth text-white"
              }
            />
          </div>
          <img
            src={cetysMacot}
            onClick={() => {
              startListening();
              setTextArea(true);
            }}
            className={
              !isListening
                ? "h-full smooth hover:scale-110 hover:cursor-pointer"
                : "h-0 smooth"
            }
          />
        </div>
      </div>

      <div className="h-[35%] w-full flex justify-center items-center">
        <textarea
          className={
            !textArea
              ? "w-0 smooth py-6"
              : "w-2/3 py-6 px-10 rounded-full smooth shadow-2xl"
          }
          readOnly
          value={textVal}
        ></textarea>
      </div>
    </div>
  );
}

export default Home;
