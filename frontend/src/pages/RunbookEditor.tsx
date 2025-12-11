import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { runbooksApi, foldersApi, tagsApi } from '../services/api';

export const RunbookEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const editorRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const { data: runbook } = useQuery({
    queryKey: ['runbook', id],
    queryFn: async () => {
      if (!id || id === 'new') return null;
      const response = await runbooksApi.getOne(id);
      return response.data;
    },
    enabled: !!id && id !== 'new',
  });

  const { data: folders } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const response = await foldersApi.getAll();
      return response.data;
    },
  });

  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await tagsApi.getAll();
      return response.data;
    },
  });

  useEffect(() => {
    if (runbook) {
      console.log('Loading runbook:', runbook);
      setTitle(runbook.title);
      setDescription(runbook.description || '');
      setSelectedFolderId(runbook.folderId || '');
      setSelectedTagIds(runbook.tags?.map((t) => t.tag.id) || []);

      // Load content into editor
      const htmlContent = runbook.content?.html || '';
      console.log('Loading content:', htmlContent);
      setContent(htmlContent);

      // Set innerHTML directly to the editor
      if (editorRef.current) {
        if (htmlContent) {
          editorRef.current.innerHTML = htmlContent;
          console.log('Content loaded into editor');
        } else {
          editorRef.current.innerHTML = '<p>No content yet. Start writing...</p>';
        }
      }
    }
  }, [runbook]);

  // Initialize empty editor for new runbooks
  useEffect(() => {
    if (id === 'new' && editorRef.current && !content) {
      editorRef.current.innerHTML = '<p>Start writing your runbook here...</p>';
    }
  }, [id]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Get the latest content from the editor
      const currentContent = editorRef.current?.innerHTML || content;

      const data = {
        title,
        description,
        content: {
          html: currentContent,
        },
        folderId: selectedFolderId || undefined,
        tagIds: selectedTagIds,
      };

      console.log('Saving runbook:', data);

      if (id && id !== 'new') {
        return runbooksApi.update(id, data);
      } else {
        return runbooksApi.create(data);
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['runbooks'] });
      queryClient.invalidateQueries({ queryKey: ['runbook', id] });

      alert('Runbook saved successfully!');

      if (id === 'new') {
        navigate(`/runbooks/${response.data.id}`);
      }
    },
    onError: (error: any) => {
      console.error('Save error:', error);
      alert(`Failed to save: ${error.response?.data?.message || error.message}`);
    },
  });

  const applyFormat = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    updateActiveFormats();
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const updateActiveFormats = () => {
    const formats = new Set<string>();

    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('strikeThrough')) formats.add('strikethrough');
    if (document.queryCommandState('insertUnorderedList')) formats.add('ul');
    if (document.queryCommandState('insertOrderedList')) formats.add('ol');

    setActiveFormats(formats);
  };

  const insertCodeBlock = () => {
    const code = prompt('Enter code:');
    if (code) {
      const pre = document.createElement('pre');
      const codeEl = document.createElement('code');
      codeEl.textContent = code;
      codeEl.className = 'block bg-gray-900 text-gray-100 p-4 rounded-lg my-2 overflow-x-auto';
      pre.appendChild(codeEl);

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(pre);
      }

      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      applyFormat('insertImage', url);
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const toolbarButtons = [
    { icon: 'B', command: 'bold', title: 'Bold (Ctrl+B)', format: 'bold', class: 'font-bold' },
    { icon: 'I', command: 'italic', title: 'Italic (Ctrl+I)', format: 'italic', class: 'italic' },
    { icon: 'U', command: 'underline', title: 'Underline (Ctrl+U)', format: 'underline', class: 'underline' },
    { icon: 'S', command: 'strikeThrough', title: 'Strikethrough', format: 'strikethrough', class: 'line-through' },
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">C</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Chainboard</span>
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={() => navigate('/runbooks')}
            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            ← Runbooks
          </button>
          <span className="text-gray-400">|</span>
          <span className="text-sm font-medium text-gray-700">
            {id === 'new' ? 'New Runbook' : 'Edit Runbook'}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => saveMutation.mutate()}
            disabled={!title || saveMutation.isPending}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saveMutation.isPending ? 'Saving...' : '💾 Save'}
          </button>

          <div className="w-px h-6 bg-gray-300" />

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">👤</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Workspace Admin</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-200 px-6 py-3 bg-gray-50">
        <div className="flex items-center space-x-1">
          {toolbarButtons.map((btn) => (
            <button
              key={btn.command}
              onClick={() => applyFormat(btn.command)}
              title={btn.title}
              className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${btn.class} ${
                activeFormats.has(btn.format) ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'
              }`}
            >
              {btn.icon}
            </button>
          ))}

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <select
            onChange={(e) => applyFormat('fontSize', e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
            defaultValue="3"
          >
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>

          <input
            type="color"
            onChange={(e) => applyFormat('foreColor', e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
            title="Text Color"
          />

          <input
            type="color"
            onChange={(e) => applyFormat('hiliteColor', e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
            title="Highlight Color"
          />

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <button
            onClick={(e) => {
              e.preventDefault();
              applyFormat('insertUnorderedList');
            }}
            className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.has('ul') ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'
            }`}
            title="Bullet List"
          >
            ≡ Bullets
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              applyFormat('insertOrderedList');
            }}
            className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.has('ol') ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'
            }`}
            title="Numbered List"
          >
            1. Numbers
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <button
            onClick={insertCodeBlock}
            className="px-3 py-2 bg-white text-gray-700 rounded hover:bg-gray-200 transition-colors"
            title="Insert Code Block"
          >
            &lt;/&gt; Code
          </button>

          <button
            onClick={insertImage}
            className="px-3 py-2 bg-white text-gray-700 rounded hover:bg-gray-200 transition-colors"
            title="Insert Image"
          >
            🖼️ Image
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Title */}
          <input
            type="text"
            placeholder="Runbook Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-bold border-none outline-none mb-4 placeholder-gray-300"
          />

          {/* Description */}
          <input
            type="text"
            placeholder="Brief description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-lg text-gray-600 border-none outline-none mb-6 placeholder-gray-300"
          />

          {/* Metadata */}
          <div className="flex space-x-4 mb-6">
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">No Folder</option>
              {folders?.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.icon} {folder.name}
                </option>
              ))}
            </select>

            <div className="flex-1 border border-gray-300 rounded-lg p-2">
              <div className="flex flex-wrap gap-2">
                {tags?.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      setSelectedTagIds((prev) =>
                        prev.includes(tag.id)
                          ? prev.filter((id) => id !== tag.id)
                          : [...prev, tag.id]
                      );
                    }}
                    className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                      selectedTagIds.includes(tag.id)
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={
                      selectedTagIds.includes(tag.id)
                        ? { backgroundColor: tag.color }
                        : undefined
                    }
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onMouseUp={updateActiveFormats}
            onKeyUp={updateActiveFormats}
            className="min-h-[500px] p-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 prose max-w-none"
            style={{
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
            }}
            suppressContentEditableWarning
          />
        </div>
      </div>
    </div>
  );
};
