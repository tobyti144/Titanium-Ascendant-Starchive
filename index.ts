/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

// --- Data Definitions ---

interface ArchiveItem {
    id: string;
    name: string;
    type: string;
    category: 'document' | 'media' | 'data';
    date: string;
    description: string;
    icon?: string;
}

const ARCHIVE_DATA: ArchiveItem[] = [
    {
        id: 'doc-1',
        name: 'Titanium_Memoirs.pdf',
        type: 'Compressed PDF Document',
        category: 'document',
        date: 'March 2, 2026',
        description: 'Personal accounts of the Titanium era explorations.',
        icon: 'fas fa-file-pdf text-ascendant'
    },
    {
        id: 'doc-2',
        name: 'HR_Policies_Draft.docx',
        type: 'Word Document',
        category: 'document',
        date: 'Feb 27, 2026',
        description: 'Draft policies for the upcoming fiscal year.',
        icon: 'fas fa-file-word text-ascendant'
    },
    {
        id: 'doc-3',
        name: 'Project_Alpha_Specs.pdf',
        type: 'PDF Document',
        category: 'document',
        date: 'Jan 15, 2026',
        description: 'Technical specifications for Project Alpha.',
        icon: 'fas fa-file-pdf text-ascendant'
    },
    {
        id: 'media-1',
        name: 'Asset_4272.jpg',
        type: 'Image / JPEG',
        category: 'media',
        date: 'Feb 10, 2026',
        description: 'Site survey photo from Sector 7.'
    },
    {
        id: 'media-2',
        name: 'Asset_2228.png',
        type: 'Image / PNG',
        category: 'media',
        date: 'Feb 12, 2026',
        description: 'UI Mockup for the internal dashboard.'
    },
    {
        id: 'media-3',
        name: 'Asset_5379.jpg',
        type: 'Image / JPEG',
        category: 'media',
        date: 'March 1, 2026',
        description: 'Team building event photo.'
    },
    {
        id: 'data-1',
        name: 'Facebook_Export_Data_1',
        type: 'application/octet-stream',
        category: 'data',
        date: 'March 2, 2026',
        description: 'Social media trend analysis data export.'
    },
    {
        id: 'data-2',
        name: 'Facebook_Export_Data_2',
        type: 'application/octet-stream',
        category: 'data',
        date: 'March 2, 2026',
        description: 'Extended social media trend analysis data export.'
    }
];

// --- UI Logic ---

function renderArchive() {
    const docGrid = document.getElementById('documents-grid');
    const mediaGrid = document.getElementById('media-grid');
    const dataTableBody = document.getElementById('data-table-body');
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const searchTerm = searchInput?.value.toLowerCase() || '';

    if (docGrid) docGrid.innerHTML = '';
    if (mediaGrid) mediaGrid.innerHTML = '';
    if (dataTableBody) dataTableBody.innerHTML = '';

    ARCHIVE_DATA.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.description.toLowerCase().includes(searchTerm)
    ).forEach(item => {
        if (item.category === 'document' && docGrid) {
            docGrid.innerHTML += `
                <div class="rounded-xl archive-card overflow-hidden">
                    <div class="p-5 flex items-start gap-4">
                        <div class="p-3 bg-titanium-900 rounded-lg border border-titanium-700">
                            <i class="${item.icon || 'fas fa-file'} text-2xl"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-sm font-bold text-white truncate">${item.name}</h3>
                            <p class="text-xs text-titanium-400 mt-1">${item.type}</p>
                            <p class="text-[10px] text-titanium-500 mt-2 font-mono uppercase tracking-wider"><i class="far fa-clock mr-1"></i> ${item.date}</p>
                        </div>
                    </div>
                    <div class="bg-titanium-900/50 px-5 py-3 border-t border-titanium-700 flex justify-between items-center">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-ascendant/10 text-ascendant border border-ascendant/20 uppercase tracking-widest">
                            ${item.category}
                        </span>
                        <button class="text-titanium-500 hover:text-ascendant transition-colors"><i class="fas fa-download"></i></button>
                    </div>
                </div>
            `;
        } else if (item.category === 'media' && mediaGrid) {
            mediaGrid.innerHTML += `
                <div class="rounded-xl archive-card overflow-hidden group">
                    <div class="aspect-w-1 aspect-h-1 bg-titanium-900 relative flex items-center justify-center h-40 border-b border-titanium-700">
                        <i class="fas fa-image text-titanium-700 text-3xl"></i>
                        <div class="absolute inset-0 bg-titanium-950 bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button class="text-titanium-950 bg-ascendant p-2.5 rounded-full hover:bg-white transition-all transform scale-90 group-hover:scale-100 shadow-lg"><i class="fas fa-eye"></i></button>
                        </div>
                    </div>
                    <div class="p-3">
                        <p class="text-xs font-bold text-titanium-200 truncate">${item.name}</p>
                        <p class="text-[10px] text-titanium-500 font-mono">${item.type}</p>
                    </div>
                </div>
            `;
        } else if (item.category === 'data' && dataTableBody) {
            dataTableBody.innerHTML += `
                <tr class="hover:bg-titanium-700/30 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <i class="fas fa-microchip text-ascendant mr-3 text-lg"></i>
                            <div class="text-sm font-bold text-titanium-100">${item.name}</div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-xs font-mono text-titanium-400">${item.type}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-xs font-mono text-titanium-400">${item.date}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" class="text-ascendant hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">Access</a>
                    </td>
                </tr>
            `;
        }
    });
}

function openTab(tabName: string) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(button => {
        button.classList.remove('active', 'text-ascendant');
        button.classList.add('text-titanium-500');
    });

    const targetTab = document.getElementById('tab-' + tabName);
    if (targetTab) targetTab.classList.add('active');

    const activeBtn = document.getElementById('btn-' + tabName);
    if (activeBtn) {
        activeBtn.classList.add('active', 'text-ascendant');
        activeBtn.classList.remove('text-titanium-500');
    }
}

// --- AI Librarian Logic ---

async function askLibrarian() {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const responseContainer = document.getElementById('ai-response-container');
    const responseText = document.getElementById('ai-response-text');
    const query = searchInput?.value;

    if (!query || !responseText || !responseContainer) return;

    responseContainer.classList.remove('hidden');
    responseText.innerHTML = 'Thinking...';

    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY! });
        const model = 'gemini-2.0-flash';
        
        const archiveContext = ARCHIVE_DATA.map(item => 
            `- ${item.name} (${item.type}): ${item.description}`
        ).join('\n');

        const response = await ai.models.generateContent({
            model: model,
            contents: `You are a Digital Librarian. A user is asking about the archive. 
            Archive Contents:
            ${archiveContext}
            
            User Query: ${query}
            
            Provide a helpful, concise response based ONLY on the archive contents above. If you can't find anything relevant, say so politely.`
        });

        const text = response.text || 'No response from librarian.';
        responseText.innerHTML = await marked.parse(text);
    } catch (error) {
        console.error('AI Error:', error);
        responseText.innerHTML = 'Sorry, I encountered an error while searching the archive.';
    }
}

// --- Initialization ---

function init() {
    // Event Listeners
    document.getElementById('btn-documents')?.addEventListener('click', () => openTab('documents'));
    document.getElementById('btn-media')?.addEventListener('click', () => openTab('media'));
    document.getElementById('btn-data')?.addEventListener('click', () => openTab('data'));
    
    document.getElementById('search-input')?.addEventListener('input', renderArchive);
    document.getElementById('ai-ask-btn')?.addEventListener('click', askLibrarian);

    // Initial Render
    renderArchive();
}

window.addEventListener('DOMContentLoaded', init);
