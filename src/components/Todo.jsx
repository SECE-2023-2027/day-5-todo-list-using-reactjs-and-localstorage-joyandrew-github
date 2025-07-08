import React, { useState } from 'react';
import { Trash2, Edit3, Check, X, Square, CheckSquare, MousePointer } from 'lucide-react';

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const addTodo = () => {
    if (newTodo.trim()) {
      const newId = Math.max(...todos.map(t => t.id), 0) + 1;
      setTodos([...todos, { id: newId, text: newTodo.trim(), completed: false }]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const deleteSelectedTodos = () => {
    setTodos(todos.filter(todo => !selectedTodos.includes(todo.id)));
    setSelectedTodos([]);
    setIsSelectionMode(false);
  };

  const toggleSelectTodo = (id) => {
    setSelectedTodos(prev => 
      prev.includes(id) 
        ? prev.filter(todoId => todoId !== id)
        : [...prev, id]
    );
  };

  const selectAllTodos = () => {
    if (selectedTodos.length === todos.length) {
      setSelectedTodos([]);
    } else {
      setSelectedTodos(todos.map(todo => todo.id));
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedTodos([]);
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-indigo-400 p-4">
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 drop-shadow-lg">Add a Todo</h1>
            <div className="flex gap-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Todo"
                className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-md rounded-2xl text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-300/50 transition-all duration-300"
              />
              <button
                onClick={addTodo}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Save
              </button>
            </div>
          </div>

          {/* Todo List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 drop-shadow-md">Your Todos</h2>
              <div className="flex gap-2">
                <button
                  onClick={toggleSelectionMode}
                  className={`w-10 h-10 flex items-center justify-center rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    isSelectionMode 
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg'
                  }`}
                  title={isSelectionMode ? 'Cancel Selection' : 'Select Mode'}
                >
                  {isSelectionMode ? <X className="w-5 h-5" /> : <MousePointer className="w-5 h-5" />}
                </button>
                {isSelectionMode && (
                  <>
                    <button
                      onClick={selectAllTodos}
                      className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {selectedTodos.length === todos.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                      onClick={deleteSelectedTodos}
                      disabled={selectedTodos.length === 0}
                      className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                        selectedTodos.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white shadow-lg hover:shadow-xl'
                      }`}
                    >
                      Delete ({selectedTodos.length})
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-4 backdrop-blur-md rounded-2xl transition-all duration-300 border transform hover:scale-102 ${
                    isSelectionMode && selectedTodos.includes(todo.id)
                      ? 'bg-white/25 ring-2 ring-purple-300/70 border-purple-300/50 shadow-lg'
                      : 'bg-white/15 border-white/20 hover:bg-white/20 shadow-md'
                  }`}
                >
                  {/* Selection checkbox (only visible in selection mode) */}
                  {isSelectionMode && (
                    <button
                      onClick={() => toggleSelectTodo(todo.id)}
                      className="w-6 h-6 flex items-center justify-center text-white hover:text-purple-200 transition-all duration-200 transform hover:scale-110"
                    >
                      {selectedTodos.includes(todo.id) ? (
                        <CheckSquare className="w-6 h-6 text-purple-200" />
                      ) : (
                        <Square className="w-6 h-6" />
                      )}
                    </button>
                  )}

                  {/* Completion checkbox (hidden in selection mode) */}
                  {!isSelectionMode && (
                    <button
                      onClick={() => toggleComplete(todo.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                        todo.completed
                          ? 'bg-gradient-to-r from-green-400 to-emerald-400 border-green-400 shadow-lg'
                          : 'border-white/40 hover:border-purple-300/70 hover:bg-white/10'
                      }`}
                    >
                      {todo.completed && <Check className="w-4 h-4 text-white" />}
                    </button>
                  )}

                  {/* Todo Text */}
                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={handleEditKeyPress}
                        className="w-full px-3 py-2 bg-white/25 backdrop-blur-md rounded-xl text-gray-900 placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-300/50 transition-all duration-300 font-semibold"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`font-semibold text-lg ${
                          todo.completed
                            ? 'line-through text-gray-500 opacity-80'
                            : 'text-gray-900'
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons (hidden in selection mode) */}
                  {!isSelectionMode && (
                    <div className="flex gap-2">
                      {editingId === todo.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(todo.id, todo.text)}
                            className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}