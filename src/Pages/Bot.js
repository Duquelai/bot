import React, { useState, useEffect } from "react";

import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

import styled from "styled-components";

import { Box, TextField, Button, IconButton } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";

import { obterCategorias } from "../apis/respostas";

import SpeechSynthesis from "./speechSynthesis";

const Flex = styled(Box)`
  display: flex;
`;

const Message = styled(Box)`
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 4px;
  border-radius: 4px;
`;

const Chatbox = styled(Flex)`
  flex-direction: column;
  width: 400px;
`;

const Icon = styled(IconButton)`
  padding: 10px !important;
  margin-right: 5px !important;
`;

const Bot = () => {
  const [messages, setMessages] = useState([]);
  const [state, setState] = useState("");
  const [play, setPlay] = useState(true);

  const speech = useSpeechRecognition();

  const handleFetch = frase => {
    if (frase.length > 0) {
      setMessages([...messages, { from: "user", frase }]);

      return obterCategorias(frase).then(response => {
        const speechSynthesis = new SpeechSynthesis({
          text: response,
          lang: "pt-BR",
          voice: "Google Portuguese"
        });
        speechSynthesis.onend(setPlay(false));
        speechSynthesis.speak();
        setPlay(true);
        setMessages(messages => [
          ...messages,
          { from: "bot", frase: response }
        ]);
      });
    }
  };

  useEffect(() => {
    setState(speech.transcript);
  }, [speech.startListening]);

  const handleChange = e => setState(e.target.value);

  const handleEnter = e => e.key === "Enter" && handleFetch(state);

  return (
    <>
      <h2 color="#ff0">Bot de ensino</h2>
      <Flex
        justifyContent="center"
        textAlign="justify"
        flexDirection="column"
        alignItems="center"
      >
        <Chatbox padding={10}>
          <Flex justifyContent="flex-end">
            <Message bgcolor="lightcoral">Olá! Eu sou ELIOT.</Message>
          </Flex>
          {messages.length > 0 &&
            messages.map(msg =>
              msg.from === "user" ? (
                <Flex justifyContent="flex-start">
                  <Message bgcolor="cornflowerblue">{msg.frase}</Message>
                </Flex>
              ) : (
                <Flex justifyContent="flex-end">
                  <Message bgcolor="lightcoral">{msg.frase}</Message>
                </Flex>
              )
            )}
        </Chatbox>
        <Flex width="400px" justifyContent="center">
          <Box marginRight={1}>
            <TextField
              margin="none"
              fullWidth
              value={state}
              onKeyPress={handleEnter}
              onChange={handleChange}
              placeholder="message"
            ></TextField>
          </Box>
          <Icon padding={5} onClick={speech.startListening} size="small">
            <MicIcon fontSize="inherit" />
          </Icon>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleFetch(state)}
          >
            Enviar
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default Bot;
