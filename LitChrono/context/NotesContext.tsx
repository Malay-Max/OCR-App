"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Work {
    id: string;
    title: string;
    year: number;
    author: string;
}

interface NotesContextType {
    rawData: string;
    parsedWorks: Work[];
    updateNotes: (markdown: string) => Promise<void>;
    stats: {
        authorCount: number;
        workCount: number;
    };
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const DEFAULT_NOTES = `## William Shakespeare
- Hamlet (1603)
- Macbeth (1606)
- The Tempest (1611)

## Jane Austen
- Sense and Sensibility (1811)
- Pride and Prejudice (1813)
- Emma (1815)

## T.S. Eliot
- The Waste Land (1922)
- Murder in the Cathedral (1935)
`;

export function NotesProvider({ children }: { children: React.ReactNode }) {
    const [rawData, setRawData] = useState("");
    const [parsedWorks, setParsedWorks] = useState<Work[]>([]);
    const [stats, setStats] = useState({ authorCount: 0, workCount: 0 });

    // Load from API on mount
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await fetch("/api/notes");
                if (response.ok) {
                    const data = await response.json();
                    setParsedWorks(data.works);
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Failed to fetch notes:", error);
            }
        };

        // Also check local storage for raw text to populate editor
        const saved = localStorage.getItem("litChrono_notes");
        if (saved) {
            setRawData(saved);
        } else {
            setRawData(DEFAULT_NOTES);
        }

        fetchNotes();
    }, []);

    const updateNotes = async (markdown: string) => {
        setRawData(markdown);
        localStorage.setItem("litChrono_notes", markdown);

        try {
            const response = await fetch("/api/parse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markdown }),
            });

            if (response.ok) {
                const data = await response.json();
                setParsedWorks(data.works);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Failed to parse notes:", error);
        }
    };

    return (
        <NotesContext.Provider value={{ rawData, parsedWorks, updateNotes, stats }}>
            {children}
        </NotesContext.Provider>
    );
}

export function useNotes() {
    const context = useContext(NotesContext);
    if (context === undefined) {
        throw new Error("useNotes must be used within a NotesProvider");
    }
    return context;
}
