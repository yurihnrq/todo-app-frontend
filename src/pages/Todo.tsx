import React from 'react';
import Layout from '../components/layout/Layout';
import TodoTable from '../components/TodoTable';
import Form from '../components/TodoForm';
import styles from './styles/Todo.module.css';
import { useAuth } from '../context/AuthContext';
import useTodos from '../hooks/useTodos';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { todos, error, addTodo, deleteTodo, updateTodo } = useTodos(user);

  return (
    <Layout>
      <section className={styles.Todo}>
        <h2 className='dark:text-slate-200'>
          Olá {user?.email?.slice(0, user?.email?.indexOf('@'))}
        </h2>
        {error ? <span className={styles.warning}>{error}</span> : null}
        <Form addAction={addTodo} />
        <TodoTable deleteAction={deleteTodo} updateAction={updateTodo} todos={todos} />
      </section>
    </Layout>
  );
};

export default Home;
