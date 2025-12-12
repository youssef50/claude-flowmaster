import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { runbooksApi, foldersApi, tagsApi } from '../services/api';

export const RunbookEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const editorRef = useRef<HTMLDivElement>(null);
  const viewContentRef = useRef<HTMLDivElement>(null);
  const selectionRange = useRef<Range | null>(null);

  // Mode state
  const [isEditing, setIsEditing] = useState(id === 'new');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);

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
      setTitle(runbook.title);
      setDescription(runbook.description || '');
      setSelectedFolderId(runbook.folderId || '');
      setSelectedTagIds(runbook.tags?.map((t: any) => t.tag.id) || []);
      setContent(runbook.content?.html || '');

      // If editing, populate editor
      if (isEditing && editorRef.current) {
        editorRef.current.innerHTML = runbook.content?.html || '';
      }
    }
  }, [runbook, isEditing]);

  // Generate TOC and handle Code Blocks in View Mode
  useEffect(() => {
    if (!isEditing && viewContentRef.current) {
      const container = viewContentRef.current;

      // 1. Generate TOC
      const headers = container.querySelectorAll('h1, h2, h3');
      const newToc: { id: string; text: string; level: number }[] = [];
      headers.forEach((header, index) => {
        const id = header.id || `section-${index}`;
        header.id = id;
        newToc.push({
          id,
          text: header.textContent || '',
          level: parseInt(header.tagName[1]),
        });
      });
      setToc(newToc);

      // 2. Enhance Code Blocks
      const preBlocks = container.querySelectorAll('pre');
      preBlocks.forEach((pre) => {
        if (pre.parentElement?.classList.contains('code-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper relative group my-6 bg-slate-50 rounded-xl overflow-hidden shadow-sm border border-[#976266] transition-all duration-200';

        const header = document.createElement('div');
        header.className = 'flex items-center justify-between px-4 py-2 bg-[#aca0c9] border-b border-[#976266]';

        const langBadge = document.createElement('div');
        langBadge.className = 'flex space-x-1.5';
        ['bg-red-400', 'bg-yellow-400', 'bg-green-400'].forEach(color => {
          const dot = document.createElement('div');
          dot.className = `w-3 h-3 rounded-full ${color}`;
          langBadge.appendChild(dot);
        });

        const copyBtn = document.createElement('button');
        copyBtn.className = 'text-slate-500 hover:text-indigo-600 text-xs font-medium bg-white hover:bg-indigo-50 border border-[#976266] px-2 py-1 rounded transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 shadow-sm';
        copyBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        `;

        copyBtn.onclick = () => {
          const code = pre.textContent || '';
          navigator.clipboard.writeText(code);
          copyBtn.innerHTML = '✨ Copied!';
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy
            `;
          }, 2000);
        };

        header.appendChild(langBadge);
        header.appendChild(copyBtn);
        wrapper.appendChild(header);

        pre.parentNode?.insertBefore(wrapper, pre);

        pre.className = 'p-4 overflow-x-auto text-sm text-slate-700 font-mono leading-relaxed';
        pre.style.margin = '0';
        pre.style.backgroundColor = 'transparent';

        wrapper.appendChild(pre);
      });

      // 3. Enhance Images
      const images = container.querySelectorAll('img');
      images.forEach(img => {
        img.className = 'rounded-xl shadow-lg my-6 max-w-full border border-gray-100';
      });

      // 4. Enhance Links
      const links = container.querySelectorAll('a');
      links.forEach(link => {
        link.className = 'text-indigo-600 hover:text-indigo-800 underline underline-offset-2 decoration-indigo-200 hover:decoration-indigo-600 transition-all';
      });
    }
  }, [content, isEditing]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const currentContent = editorRef.current?.innerHTML || content;
      const data = {
        title,
        description,
        content: { html: currentContent },
        folderId: selectedFolderId || undefined,
        tagIds: selectedTagIds,
      };

      if (id && id !== 'new') {
        return runbooksApi.update(id, data);
      } else {
        return runbooksApi.create(data);
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['runbooks'] });
      queryClient.invalidateQueries({ queryKey: ['runbook', id] });
      setIsEditing(false);
      if (id === 'new') {
        navigate(`/runbooks/${response.data.id}`);
      }
    },
  });

  const saveRange = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        selectionRange.current = range.cloneRange();
      }
    }
  };

  const applyFormat = (command: string, value?: string) => {
    // Restore selection if we have one
    if (selectionRange.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(selectionRange.current);
      }
    }

    document.execCommand(command, false, value);
    editorRef.current?.focus();

    saveRange();
    updateActiveFormats();
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    if (document.queryCommandState('bold')) formats.add('bold');
    setActiveFormats(formats);
  };

  const insertCodeBlock = () => {
    const code = prompt('Enter code:');
    if (code) {
      const pre = document.createElement('pre');
      pre.textContent = code;

      if (editorRef.current) {
        // Simple append for now
        editorRef.current.appendChild(pre);
        setContent(editorRef.current.innerHTML);
      }
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) applyFormat('insertImage', url);
  };

  if (isEditing) {
    return (
      <div className="h-screen flex flex-col bg-white">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/runbooks')} className="text-gray-500 hover:text-gray-900">← Back</button>
            <span className="font-semibold text-gray-900">Editing: {title || 'Untitled'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => saveMutation.mutate()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 px-6 py-2 bg-gray-50 flex items-center space-x-2 overflow-x-auto">
          <button onClick={() => applyFormat('bold')} className="p-2 hover:bg-gray-200 rounded font-bold">B</button>
          <button onClick={() => applyFormat('italic')} className="p-2 hover:bg-gray-200 rounded italic">I</button>
          <button onClick={() => applyFormat('underline')} className="p-2 hover:bg-gray-200 rounded underline">U</button>
          <div className="w-px h-6 bg-gray-300 mx-2" />

          <select
            onChange={(e) => applyFormat('fontSize', e.target.value)}
            className="px-2 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
            defaultValue="3"
            title="Font Size"
          >
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>

          <div className="flex items-center space-x-1 border border-gray-300 rounded px-2 py-1 bg-white relative hover:bg-gray-50 cursor-pointer" title="Text Color">
            <span className="text-xs font-bold text-gray-500">A</span>
            <input
              type="color"
              onChange={(e) => applyFormat('foreColor', e.target.value)}
              className="w-6 h-6 rounded border-none p-0 cursor-pointer absolute opacity-0 left-0 top-0 h-full w-full"
              defaultValue="#000000"
            />
            <div className="w-4 h-4 rounded-full border border-gray-200" style={{ background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)' }}></div>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button onClick={() => applyFormat('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded">Bullet List</button>
          <button onClick={() => applyFormat('insertOrderedList')} className="p-2 hover:bg-gray-200 rounded">Num List</button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button onClick={insertCodeBlock} className="p-2 hover:bg-gray-200 rounded text-sm font-mono">&lt;Code&gt;</button>
          <button onClick={insertImage} className="p-2 hover:bg-gray-200 rounded">🖼️ Image</button>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-12 min-h-[800px]">
            <input
              type="text"
              placeholder="Page Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-bold border-none placeholder-gray-300 mb-6 focus:ring-0 px-0"
            />
            <input
              type="text"
              placeholder="Short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xl text-gray-500 border-none placeholder-gray-300 mb-8 focus:ring-0 px-0"
            />
            <div
              ref={editorRef}
              contentEditable
              className="prose prose-lg max-w-none focus:outline-none min-h-[500px]"
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              onMouseUp={saveRange}
              onKeyUp={saveRange}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/runbooks')}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Runbooks</span>
              <span>/</span>
              <span className="font-medium text-gray-900 truncate max-w-[200px]">{title}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied!');
              }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              <span>Copy link</span>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              <span>Edit Page</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-12 gap-12">
          <main className="col-span-12 lg:col-span-9">
            <div className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                {runbook?.folder && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    {runbook.folder.icon || '📁'} {runbook.folder.name}
                  </span>
                )}
                {runbook?.tags?.map((t: any) => (
                  <span key={t.tag.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${t.tag.color}20`, color: t.tag.color }}>
                    {t.tag.name}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">{title}</h1>
              {description && <p className="text-xl text-gray-500 leading-relaxed font-light">{description}</p>}

              <div className="mt-6 flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs mr-2">WA</div>
                  <span>Workspace Admin</span>
                </div>
                <span>•</span>
                <span>Updated {new Date(runbook?.updatedAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>

            <div
              ref={viewContentRef}
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-8 prose-a:text-indigo-600 prose-strong:text-gray-900 prose-code:text-indigo-600 prose-pre:bg-gray-900 prose-pre:shadow-lg prose-pre:rounded-xl prose-img:rounded-xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </main>

          <aside className="hidden lg:block col-span-3">
            <div className="sticky top-24">
              <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">On this page</h5>
              <nav className="space-y-1">
                {toc.length === 0 && <p className="text-sm text-gray-400 italic">No sections found.</p>}
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm py-1 border-l-2 pl-4 transition-colors ${item.level === 2 ? 'border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-300' : 'border-transparent text-gray-500 hover:text-indigo-600 ml-4'
                      }`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Resources</h5>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="flex items-center text-sm text-gray-600 hover:text-indigo-600 group">
                      <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      API Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-sm text-gray-600 hover:text-indigo-600 group">
                      <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
