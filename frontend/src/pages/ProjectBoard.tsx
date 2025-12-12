import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../services/api';
import type { ProjectCard, ProjectColumn } from '../types';

export const ProjectBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [draggedCard, setDraggedCard] = useState<ProjectCard | null>(null);
  const [newCardContent, setNewCardContent] = useState<Record<string, string>>({});
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data: project } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await projectsApi.getOne(id);
      return response.data;
    },
    enabled: !!id,
  });

  const createCardMutation = useMutation({
    mutationFn: (data: { content: string; columnId: string }) =>
      projectsApi.createCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: ({ cardId, data }: { cardId: string; data: any }) =>
      projectsApi.updateCard(cardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (cardId: string) => projectsApi.deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    },
  });

  const handleDragStart = (card: ProjectCard) => {
    setDraggedCard(card);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (!draggedCard || draggedCard.columnId === columnId) {
      setDraggedCard(null);
      return;
    }

    updateCardMutation.mutate({
      cardId: draggedCard.id,
      data: { columnId },
    });

    setDraggedCard(null);
  };

  const handleAddCard = (columnId: string) => {
    const content = newCardContent[columnId];
    if (!content?.trim()) return;

    createCardMutation.mutate({ content, columnId });
    setNewCardContent({ ...newCardContent, [columnId]: '' });
  };

  const handleStartEdit = (card: ProjectCard) => {
    setEditingCardId(card.id);
    setEditingContent(card.content);
  };

  const handleSaveEdit = () => {
    if (!editingCardId || !editingContent.trim()) {
      setEditingCardId(null);
      return;
    }

    updateCardMutation.mutate({
      cardId: editingCardId,
      data: { content: editingContent },
    });

    setEditingCardId(null);
    setEditingContent('');
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
    setEditingContent('');
  };

  if (!project) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/projects')}
              className="text-gray-600 hover:text-indigo-600"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              {project.description && (
                <p className="text-xs text-gray-500 truncate">admin@youssef.in</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Client: {project.tenant?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-gray-200 flex items-center">
        <input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8d75e6]"
        />
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex space-x-4 h-full">
          {project.columns?.map((column: ProjectColumn) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{column.title}</h3>
              </div>     {/* Cards */}
              <div className="space-y-2 mb-4">
                {column.cards?.filter((card: ProjectCard) => {
                  if (!searchTerm) return true;
                  return card.content.toLowerCase().includes(searchTerm.toLowerCase());
                }).map((card: ProjectCard) => (
                  <div key={card.id}>
                    {editingCardId === card.id ? (
                      // Edit Mode
                      <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-indigo-500">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSaveEdit();
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                          className="w-full text-sm text-gray-900 border-0 focus:ring-0 resize-none p-0"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div
                        draggable
                        onDragStart={() => handleDragStart(card)}
                        className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow group"
                      >
                        <div className="flex items-start justify-between">
                          <p
                            className="text-sm text-gray-900 flex-1 cursor-pointer"
                            onClick={() => handleStartEdit(card)}
                          >
                            {card.content}
                          </p>
                          <button
                            onClick={() => {
                              if (confirm('Delete this card?')) {
                                deleteCardMutation.mutate(card.id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 ml-2"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Card */}
              <div className="space-y-2">
                <textarea
                  placeholder="Add a card..."
                  value={newCardContent[column.id] || ''}
                  onChange={(e) =>
                    setNewCardContent({ ...newCardContent, [column.id]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddCard(column.id);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={2}
                />
                <button
                  onClick={() => handleAddCard(column.id)}
                  disabled={!newCardContent[column.id]?.trim()}
                  className="w-full px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  + Add Card
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
