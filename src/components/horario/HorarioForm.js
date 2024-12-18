import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './HorarioForm.module.css';

const HorarioForm = ({ onSubmitSuccess, horarioData }) => {
  const [name, setName] = useState('');
  const [horarios, setHorarios] = useState('');
  const [category, setCategory] = useState('');
  const [discipline, setDiscipline] = useState(''); 
  const [showDiscipline, setShowDiscipline] = useState(false);
  const [avisoAntecedencia, setAvisoAntecedencia] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (horarioData) {
      setName(horarioData.name);
      setHorarios(horarioData.horarios);
      setCategory(horarioData.category || '');
      setAvisoAntecedencia(horarioData.avisoAntecedencia || '');
    }
  }, [horarioData]);

  useEffect(() => {
    const categoriesWithDiscipline = ['Apresentação', 'Prova', 'Recuperação', 'Trabalho', 'Atividade'];
    setShowDiscipline(categoriesWithDiscipline.includes(category));
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !horarios || !category || !avisoAntecedencia || (showDiscipline && !discipline)) {
      setErrorMessage('Todos os campos são obrigatórios');
      return;
    }

    const parsedHorario = new Date(horarios);
    if (isNaN(parsedHorario)) {
      setErrorMessage('Por favor, forneça uma data/hora válida.');
      return;
    }

    try {
      let response;
      const horarioPayload = {
        name,
        horarios: parsedHorario.toISOString(),
        category,
        discipline: showDiscipline ? discipline : null,
        avisoAntecedencia,
      };

      if (horarioData) {
        response = await axios.put(`/horarios/${horarioData._id}`, horarioPayload, {
          withCredentials: true,
        });
      } else {
        response = await axios.post('/horarios', horarioPayload, {
          withCredentials: true,
        });
      }

      setName('');
      setHorarios('');
      setCategory('');
      setDiscipline('');
      setAvisoAntecedencia('');
      setErrorMessage('');
      setSuccessMessage('Horário Criado');

      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      }

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar o horário:', error);
      setErrorMessage('Erro ao salvar o horário. Tente novamente.');
    }
  };

  return (
    <div className={styles.form}>
      <h2>{horarioData ? 'Editar Horário' : 'Novo Horário'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome"
            required
          />
        </div>
        <div>
          <label htmlFor="horarios">Horário:</label>
          <input
            type="datetime-local"
            id="horarios"
            value={horarios}
            onChange={(e) => setHorarios(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Categoria:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="Apresentação">Apresentação</option>
            <option value="Atendimento">Atendimento</option>
            <option value="Atividade">Atividade</option>
            <option value="Evento">Evento</option>
            <option value="Orientação/Co-Orientação">Orientação/Co-Orientação</option>
            <option value="Recuperação">Recuperação</option>
            <option value="Prova">Prova</option>
            <option value="Trabalho">Trabalho</option>
          </select>
        </div>
        {showDiscipline && (
          <div>
            <label htmlFor="discipline">Disciplina:</label>
            <select
              id="discipline"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              required
            >
              <option value="">Selecione uma disciplina</option>
              <option value="TCC">TCC</option>
              <option value="Português">Português</option>
              <option value="Matemática">Matemática</option>
              <option value="Química">Química</option>
              <option value="Biologia">Biologia</option>
              <option value="Artes">Artes</option>
              <option value="Fisica">Fisica</option>
              <option value="Geografia">Geografia</option>
              <option value="Filosofia">Filosofia</option>
              <option value="Sociologia">Sociologia</option>
              <option value="Topicos de Ciencias Humanas">Topicos de Ciencias Humanas</option>
              <option value="Inglês">Inglês</option>
              <option value="Espanhol">Espanhol</option>
              <option value="Oratoria">Oratoria</option>
              <option value="ArtDesenvolvimento Web (1 Á 3)es">Desenvolvimento Web (1 Á 3)</option>
              <option value="Introdução a Computação">Introdução a Computação</option>
              <option value="Programação (1 Á 2)">Programação (1 Á 2)</option>
              <option value="Desenvolvimento para Dispositivos Moveis">Desenvolvimento para Dispositivos Moveis</option>
              <option value="Matematica Aplicada">Matematica Aplicada</option>
              <option value="Metodologia CIentifica">Metodologia CIentifica</option>
              <option value="Redes Para Computação">Redes Para Computação</option>
              <option value="Banco De Dados">Banco De Dados</option>
            </select>
          </div>
        )}
        <div>
          <label htmlFor="avisoAntecedencia">Aviso de Antecedência:</label>
          <select
            id="avisoAntecedencia"
            value={avisoAntecedencia}
            onChange={(e) => setAvisoAntecedencia(e.target.value)}
            required
          >
            <option value="">Selecione o tempo de antecedência</option>
            <option value="15">15 minutos</option>
            <option value="30">30 minutos</option>
            <option value="60">1 hora</option>
            <option value="90">1 hora e meia</option>
            <option value="120">2 horas</option>
            <option value="1440">1 dia</option>
            <option value="2880">2 dias</option>
            <option value="10080">1 semana</option>
          </select>
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        <button type="submit">{horarioData ? 'Atualizar Horário' : 'Salvar Horário'}</button>
      </form>
    </div>
  );
};

export default HorarioForm;
