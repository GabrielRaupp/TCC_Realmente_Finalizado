import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import savings from '../../img/savings.svg';
import LinkButton from '../layout/LinkButton';

function Home() {
  const [output, setOutput] = useState('Diga algo...');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      const actions = {
        'criar conta': () => {
          window.location.href = '/Cadastro';
        },
        'mudar fundo': () => {
          document.body.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
          setOutput('Cor de fundo alterada!');
        },
        'mostrar mensagem': () => {
          setOutput('Você está usando o IntelAgend!');
        },
      };

      const startRecognition = () => {
        if (isListening) return; // Evita múltiplos starts
        setIsListening(true);
        recognition.start();
        setOutput('Escutando...');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setOutput(`Você disse: "${transcript}"`);

        if (actions[transcript]) {
          actions[transcript]();
        } else {
          setOutput(`Comando não reconhecido: "${transcript}"`);
        }
      };

      recognition.onerror = (event) => {
        setOutput(`Erro no reconhecimento de voz: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setOutput('Reconhecimento finalizado. Clique no botão para recomeçar.');
        setIsListening(false);
      };

      document.getElementById('start-voice').addEventListener('click', startRecognition);
    } else {
      setOutput('Seu navegador não suporta reconhecimento de voz.');
    }
  }, [isListening]);

  return (
    <section className={styles.home_container}>
      <h1>
        Bem-vindo ao <span>IntelAgend</span>
      </h1>
      <p>Crie sua conta para começar a usufruir do nosso sistema!</p>
      <button id="start-voice" className={styles.voice_button}>
        Iniciar Comando de Voz
      </button>
      <p className={styles.output}>{output}</p>
      <LinkButton className={styles.create} to="/Cadastro" text="Criar conta " />
      <img src={savings} alt="Savings" />
    </section>
  );
}

export default Home;
