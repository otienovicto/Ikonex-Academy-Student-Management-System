// App Context
import { createContext, useState } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [scores, setScores] = useState([]);

  const updateStudents = (data) => setStudents(data);
  const updateStreams = (data) => setStreams(data);
  const updateSubjects = (data) => setSubjects(data);
  const updateScores = (data) => setScores(data);

  return (
    <AppContext.Provider
      value={{
        students,
        streams,
        subjects,
        scores,
        updateStudents,
        updateStreams,
        updateSubjects,
        updateScores,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
