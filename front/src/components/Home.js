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
  const [loading, setLoading] = useState(false);

  const [textVal, setTextVal] = useState("");

  const [aiRes, setAiRes] = useState("");

  const [dbRes, setDbRes] = useState("");

  useEffect(() => {
    setTextVal(text);
    if (text != "") {
        generateResponse();
    }
  }, [text]);

  useEffect(() => {
    if(aiRes != ""){
        handleDb(aiRes);
    }
  }, [aiRes])

  useEffect(() => {
    if (dbRes != "") {
        handleCleanRes(dbRes);
    }
  }, [dbRes])

  const handleOpenAi = async () => {
    console.log("fetching open ai endpoint...");

    try {
      const bodyText = {
        text: text,
      };
      setLoading(true);
      const response = await fetch(`${actualUrl}/chat`, {
        method: "POST",
        body: JSON.stringify(bodyText),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      setLoading(false);
      setTextVal(data.content);
      const newData = data.toLowerCase();

      setAiRes(newData);
    } catch (err) {
      alert("Error al conectar con el servidor");
      console.log(err);
    }
  };
  
  const handleDb = async (queryRes) => {
    var dummy = {
        query: queryRes,
    }
    if (queryRes[0] == "#"){
        const newQuery = queryRes.substring(1)
        dummy = {
            query: newQuery,
        }
    }
    
    try {
        const data = await fetch(`${actualUrl}/query`, {
            method: "POST",
            body: JSON.stringify(dummy),
            headers: { "Content-Type": "application/json" },
        })

        const dataRes = await data.json();

        setDbRes(JSON.stringify(dataRes));

    } catch(err) {
        console.log(err)
    }
    
  }

  const handleCleanRes = async (textToClear) => {
    console.log("fetching open ai endpoint...");

    try {
      const bodyText = {
        text: textToClear,
        ogPropmt: text,
      };

      const response = await fetch(`${actualUrl}/clear`, {
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

  const generateResponse = () => {
    handleOpenAi();
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
      <div className="absolute w-full flex justify-center items-center">
        <LoadingComponent isLoading={loading} />
      </div>
      <div className="h-[35%] w-full flex flex-col justify-center items-center ">
        <div className=" w-2/3 mb-[20px] flex flex-col justify-between gap-4">
          {text && (
            <div className="w-full flex">
              <div className=" bg-white/90 w-fit px-10 py-3 rounded-3xl rounded-tl-none max-w-[50%]">
                {text}
              </div>
            </div>
          )}
          {textVal && loading == false && (
            <div className="w-full flex justify-end">
              <div className=" bg-white/90 w-fit px-10 py-3 rounded-3xl rounded-tr-none max-w-[50%]">
                {textArea ? textVal : ""}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const LoadingComponent = ({ isLoading }) => {
  return (
    <div
      className={
        `bg-white flex space-x-2 px-5 py-2 rounded-full justify-center items-center w-30 shadow-lg w-fit duration-100` +
        (isLoading ? " opacity-100" : " opacity-0")
      }
    >
      <div className="bg-blue-600 p-2 w-4 h-4 rounded-full animate-bounce blue-circle"></div>
      <div className="bg-green-600 p-2 w-4 h-4 rounded-full animate-bounce green-circle"></div>
      <div className="bg-red-600 p-2 w-4 h-4 rounded-full animate-bounce red-circle"></div>
    </div>
  );
};

export default Home;
