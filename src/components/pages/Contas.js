import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Contas.module.css';

function Contas() {
  const [data, setData] = useState({ users: [], horarios: [] });
  const [loading, setLoading] = useState(true);
  const [visibleHorarios, setVisibleHorarios] = useState({});
  const [newHorario, setNewHorario] = useState({
    name: '',
    horarios: '',
    category: '',
    avisoAntecedencia: '',
    discipline: '',
  });
  const [showDiscipline, setShowDiscipline] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios
      .get('/contas', { withCredentials: true })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      });
  }, []);

  const toggleHorarios = (userId) => {
    setVisibleHorarios((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  const handleNewHorarioChange = (e) => {
    const { id, value } = e.target;
    setNewHorario((prev) => ({ ...prev, [id]: value }));

    if (id === 'category') {
      const categoriesWithDiscipline = ['Apresentação', 'Prova', 'Trabalho', 'Atividade'];
      setShowDiscipline(categoriesWithDiscipline.includes(value));
    }
  };

  const handleAddHorario = async (userId) => {
    try {
      if (
        !newHorario.name ||
        !newHorario.horarios ||
        !newHorario.category ||
        !newHorario.avisoAntecedencia ||
        (showDiscipline && !newHorario.discipline)
      ) {
        setErrorMessage('Todos os campos são obrigatórios.');
        return;
      }

      const response = await axios.post(
        `/horarios/${userId}`,
        { ...newHorario },
        { withCredentials: true }
      );
      setSuccessMessage('Horário adicionado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setNewHorario({
        name: '',
        horarios: '',
        category: '',
        avisoAntecedencia: '',
        discipline: '',
      });
      setData((prevData) => ({
        ...prevData,
        horarios: [...prevData.horarios, response.data],
      }));
    } catch (error) {
      console.error('Erro ao adicionar horário:', error);
      setErrorMessage('Erro ao adicionar horário. Tente novamente.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.contas_container}>
      <h2>Usuários</h2>
      {data.users.map((user) => (
        <div className={styles.contas_card} key={user._id}>
          <h4>{user.username}</h4>
          <ul>
            <li>
              <p>
                <span>Email:</span> {user.email}
              </p>
            </li>
            <li>
              <p>
                <span>Campus:</span> {user.campus}
              </p>
            </li>
            <li>
              <p>
                <span>Data de criação:</span>{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </li>
          </ul>
          <div className={styles.contas_card_actions}>
            <button onClick={() => toggleHorarios(user._id)}>
              {visibleHorarios[user._id] ? 'Ocultar horários' : 'Mostrar horários'}
            </button>
          </div>

          {visibleHorarios[user._id] && (
            <div>
              <h3>Horários</h3>
              <ul>
                {data.horarios
                  .filter((horario) => horario.user._id === user._id)
                  .map((horario) => (
                    <li key={horario._id}>
                      <p>
                        <span>Nome:</span> {horario.name}
                      </p>
                      <p>
                        <span>Categoria:</span> {horario.category}
                      </p>
                    </li>
                  ))}
              </ul>

              <div className={styles.adicionar_horario}>
                <h3>Adicionar Horário</h3>
                <div>
                  <label htmlFor="name">Nome:</label>
                  <input
                    type="text"
                    id="name"
                    value={newHorario.name}
                    onChange={handleNewHorarioChange}
                    placeholder="Digite o nome"
                  />
                </div>
                <div>
                  <label htmlFor="horarios">Horário:</label>
                  <input
                    type="datetime-local"
                    id="horarios"
                    value={newHorario.horarios}
                    onChange={handleNewHorarioChange}
                  />
                </div>
                <div>
                  <label htmlFor="category">Categoria:</label>
                  <select
                    id="category"
                    value={newHorario.category}
                    onChange={handleNewHorarioChange}
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Apresentação">Apresentação</option>
                    <option value="Atividade">Atividade</option>
                    <option value="Prova">Prova</option>
                    <option value="Trabalho">Trabalho</option>
                  </select>
                </div>
                {showDiscipline && (
                  <div>
                    <label htmlFor="discipline">Disciplina:</label>
                    <select
                      id="discipline"
                      value={newHorario.discipline}
                      onChange={handleNewHorarioChange}
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
                    value={newHorario.avisoAntecedencia}
                    onChange={handleNewHorarioChange}
                  >
                    <option value="">Selecione o tempo</option>
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                  </select>
                </div>
                <button onClick={() => handleAddHorario(user._id)}>Adicionar Horário</button>
              </div>
            </div>
          )}
        </div>
      ))}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
}

export default Contas;
