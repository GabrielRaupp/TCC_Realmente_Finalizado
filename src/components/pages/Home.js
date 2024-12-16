import React, { useEffect, useState } from 'react'
import styles from './Home.module.css'
import savings from '../../img/savings.svg'
import LinkButton from '../layout/LinkButton'

function Home() {
  const [output, setOutput] = useState('Diga algo...')

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.lang = 'pt-BR'
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      const actions = {
        'criar conta': () => {
          window.location.href = '/Cadastro'
        },
        'mudar fundo': () => {
          document.body.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
        },
        'mostrar mensagem': () => {
          setOutput('Você está usando o IntelAgend!')
        },
      }

      const startRecognition = () => {
        recognition.start()
        setOutput('Escutando...')
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase()
        setOutput(`Você disse: "${transcript}"`)

        if (actions[transcript]) {
          actions[transcript]()
        } else {
          setOutput(`Comando não reconhecido: "${transcript}"`)
        }
      }

      recognition.onerror = (event) => {
        setOutput(`Erro: ${event.error}`)
      }

      recognition.onend = () => {
        setOutput('Reconhecimento finalizado. Clique novamente para falar.')
      }

      // Inicia o reconhecimento ao montar o componente
      document.getElementById('start-voice').addEventListener('click', startRecognition)
    } else {
      setOutput('Seu navegador não suporta reconhecimento de voz.')
    }
  }, [])

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
  )
}

export default Home
