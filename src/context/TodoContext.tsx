import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import FirebaseTodoRepository from '../backend/repositories/FirebaseTodoRepository';
import Todo from '../core/Todo';
import { ITodoRepository } from '../core/ITodoRepository';
import { useAuthContext } from './AuthContext';
import ICategoryRepository from '../core/ICategoryRepository';
import FirebaseCategoryRepository from '../backend/repositories/FirebaseCategoryRepository';

interface ITodoContext {
  todos: Todo[];
  categories: string[];
  error: string | null;
  addTodo: (todo: string) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (todo: Todo) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  selectCategory: (category: string) => void;
}

const initialContext: ITodoContext = {
  todos: [],
  categories: [],
  error: null,
  addTodo: () => {
    return;
  },
  updateTodo: () => {
    return;
  },
  deleteTodo: () => {
    return;
  },
  addCategory: () => {
    return;
  },
  deleteCategory: () => {
    return;
  },
  selectCategory: () => {
    return;
  }
};

const TodoContext = createContext<ITodoContext>(initialContext);

export const useTodoContext = () => useContext<ITodoContext>(TodoContext);

const TodoProvider: React.FC = ({ children }) => {
  const { user } = useAuthContext();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('default');
  const [error, setError] = useState<string | null>(null);

  const todoRepository: ITodoRepository = new FirebaseTodoRepository();
  const categoryRepository: ICategoryRepository = new FirebaseCategoryRepository();

  useEffect(() => {
    if (user) {
      getCategories();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getTodos();
    }
  }, [categories, selectedCategory]);

  const getTodos = useCallback(async () => {
    if (!user) return;

    try {
      const todos = await todoRepository.getAll(user);

      setTodos(todos);

      if (error !== null) setError(null);
    } catch (err) {
      setError('Erro: ' + err);
      console.error(error);
    }
  }, [user, error]);

  const addTodo = useCallback(
    async (todo: string) => {
      if (!user) return;

      try {
        const todoObj = new Todo(todo, false, new Date(), selectedCategory);
        await todoRepository.save(todoObj, user);

        getTodos();

        if (error !== null) setError(null);
      } catch (err) {
        setError('Erro: ' + err);
        console.error(error);
      }
    },
    [user, getTodos, error]
  );

  const deleteTodo = useCallback(
    async (todo: Todo) => {
      if (!user) return;

      try {
        await todoRepository.delete(todo, user);

        getTodos();

        if (error !== null) setError(null);
      } catch (err) {
        setError('Erro: ' + err);
        console.error(error);
      }
    },
    [user, getTodos, error]
  );

  const updateTodo = useCallback(
    async (todo: Todo) => {
      if (!user) return;

      try {
        await todoRepository.update(todo, user);

        getTodos();

        if (error !== null) setError(null);
      } catch (err) {
        setError('Erro: ' + err);
        console.error(error);
      }
    },
    [user, getTodos, error]
  );

  const getCategories = useCallback(async () => {
    if (!user) return;

    try {
      const categories = await categoryRepository.getAll(user);

      setCategories(categories);

      if (error !== null) setError(null);
    } catch (err) {
      setError('Erro: ' + err);
      console.error(error);
    }
  }, [user]);

  const addCategory = useCallback(
    async (category: string) => {
      if (!user) return;

      try {
        if (await categoryRepository.doesCategoryExist(category, user)) return;
        await categoryRepository.save(category, user);

        getCategories();

        if (error !== null) setError(null);
      } catch (err) {
        setError('Erro: ' + err);
        console.error(error);
      }
    },
    [user]
  );

  const deleteCategory = useCallback(
    async (category: string) => {
      if (!user) return;

      try {
        await categoryRepository.delete(category, user);

        getCategories();

        if (error !== null) setError(null);
      } catch (err) {
        setError('Erro: ' + err);
        console.error(error);
      }
    },
    [user]
  );

  const selectCategory = useCallback(
    (category: string) => {
      setSelectedCategory(category);
    },
    [categories]
  );

  return (
    <TodoContext.Provider
      value={{
        todos,
        categories,
        error,
        addTodo,
        updateTodo,
        deleteTodo,
        addCategory,
        deleteCategory,
        selectCategory
      }}>
      {children}
    </TodoContext.Provider>
  );
};

export default {
  Provider: TodoProvider,
  Consumer: TodoContext.Consumer
};
