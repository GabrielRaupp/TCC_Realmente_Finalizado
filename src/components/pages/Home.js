import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import savings from '../../img/savings.svg';
import LinkButton from '../layout/LinkButton';

function Home() {
  const [output, setOutput] = useState('Diga algo...');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'pt-BR';
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;
      setRecognition(recognitionInstance);

      const actions = {
        'criar conta': () => {
          window.location.href = '/Cadastro';
        },
        'mudar fundo': () => {
          const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
          document.body.style.backgroundColor = color;
          setOutput(`Fundo alterado para a cor ${color}`);
        },
        'mostrar mensagem': () => {
          setOutput('Você está usando o IntelAgend!');
        },
        'ajuda': () => {
          setOutput(
            'Comandos disponíveis: criar conta, mudar fundo, mostrar mensagem, ajuda.'
          );
        },
        'qual é o meu nome': () => {
          setOutput('Seu nome ainda não foi configurado. Cadastre-se!');
        },
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setOutput(`Você disse: "${transcript}"`);

        const command = Object.keys(actions).find((key) => transcript.includes(key));
        if (command) {
          actions[command]();
        } else {
          setOutput(
            `Comando não reconhecido: "${transcript}". Diga "ajuda" para obter os comandos disponíveis.`
          );
        }
      };

      recognitionInstance.onerror = (event) => {
        setOutput(`Erro de reconhecimento de voz: ${event.error}`);
      };

      recognitionInstance.onend = () => {
        setOutput((prevOutput) =>
          `${prevOutput}\nReconhecimento finalizado. Clique no botão para tentar novamente.`
        );
      };
    } else {
      setOutput('Seu navegador não suporta reconhecimento de voz.');
    }
  }, []);

  const startRecognition = () => {
    if (recognition) {
      recognition.start();
      setOutput('Escutando...');
    }
  };

  return (
    <section className={styles.home_container}>
      <h1>
        Bem-vindo ao <span>IntelAgend</span>
      </h1>
      <p>Crie sua conta para começar a usufruir do nosso sistema!</p>
      <button id="start-voice" className={styles.voice_button} onClick={startRecognition}>
        Iniciar Comando de Voz
      </button>
      <p className={styles.output}>{output}</p>
      <LinkButton className={styles.create} to="/Cadastro" text="Criar conta" />
      <img src={savings} alt="Savings" />
    </section>
  );
}

export default Home;
