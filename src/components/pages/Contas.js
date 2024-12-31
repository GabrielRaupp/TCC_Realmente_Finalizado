import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Contas.module.css';

function Contas() {
  const [data, setData] = useState({ users: [], horarios: [] });
  const [groupedUsers, setGroupedUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [visibleCounts, setVisibleCounts] = useState({});
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

        const grouped = response.data.users.reduce((acc, user) => {
          acc[user.campus] = acc[user.campus] || [];
          acc[user.campus].push(user);
          return acc;
        }, {});
        setGroupedUsers(grouped);

        const initialVisibleCounts = Object.keys(grouped).reduce((acc, campus) => {
          acc[campus] = 3; // Exibe 3 usuários por padrão
          return acc;
        }, {});
        setVisibleCounts(initialVisibleCounts);
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      });
  }, []);

  const handleShowMore = (campus) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [campus]: prev[campus] + 3,
    }));
  };

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
      <h2>Usuários Agrupados por Campus</h2>
      {Object.entries(groupedUsers).map(([campus, users]) => (
        <div key={campus}>
          <h3>{campus}</h3>
          {users.slice(0, visibleCounts[campus]).map((user) => (
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
                          {/* Disciplinas aqui */}
                        </select>
                      </div>
                    )}
                    <div>
                      <label htmlFor="avisoAntecedencia">Aviso Antecedência:</label>
                      <input
                        type="number"
                        id="avisoAntecedencia"
                        value={newHorario.avisoAntecedencia}
                        onChange={handleNewHorarioChange}
                        placeholder="Digite o número de dias"
                      />
                    </div>
                    <button onClick={() => handleAddHorario(user._id)}>Adicionar Horário</button>
                    {successMessage && <p className={styles.success}>{successMessage}</p>}
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                  </div>
                </div>
              )}
            </div>
          ))}
          {users.length > visibleCounts[campus] && (
            <button
              className={styles.show_more_button}
              onClick={() => handleShowMore(campus)}
            >
              Ver Mais
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Contas;
