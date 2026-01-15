import React, { useState, useCallback } from 'react';
import { useData } from '../../context/DataContext';

interface ImportCandidate {
    Name: string;
    ID: string;
    Status: string;
    StartDate?: string;
    FinishDate?: string;
}

export const useXerParserLogic = () => {
    const { dispatch } = useData();
    
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
    const [stats, setStats] = useState({ projects: 0, wbs: 0, activities: 0, relationships: 0 });
    const [parsedData, setParsedData] = useState<ImportCandidate[]>([]);

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setStats({ projects: 0, wbs: 0, activities: 0, relationships: 0 });
            setParsedData([]);
        }
    }, []);

    const runParser = useCallback(() => {
        if (!file) return;
        setStatus('processing');

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(content, "text/xml");
                
                // Basic XML parsing logic (P6 XML structure)
                const projects = xmlDoc.getElementsByTagName("PROJECT");
                const wbsNodes = xmlDoc.getElementsByTagName("WBS");
                const activities = xmlDoc.getElementsByTagName("ACTIVITY"); // Often named ACTIVITY or TASK
                const relationships = xmlDoc.getElementsByTagName("RELATIONSHIP");

                const projectCount = projects.length || 0;
                const wbsCount = wbsNodes.length || 0;
                const activityCount = activities.length || 0;
                const relCount = relationships.length || 0;
                
                // Extract minimal project data for staging
                const extractedProjects: ImportCandidate[] = [];
                for (let i = 0; i < projectCount; i++) {
                    const p = projects[i];
                    extractedProjects.push({
                        Name: p.getElementsByTagName("Name")[0]?.textContent || "Imported Project",
                        ID: p.getElementsByTagName("Id")[0]?.textContent || `IMP-${Date.now()}`,
                        Status: 'Planned',
                        StartDate: p.getElementsByTagName("StartDate")[0]?.textContent || undefined,
                        FinishDate: p.getElementsByTagName("FinishDate")[0]?.textContent || undefined
                    });
                }
                
                // Fallback if not P6 XML (e.g. random file)
                if (projectCount === 0 && activityCount === 0 && !content.includes("<PROJECT")) {
                     throw new Error("Invalid or unrecognized schedule format.");
                }

                setStats({ 
                    projects: projectCount, 
                    wbs: wbsCount, 
                    activities: activityCount, 
                    relationships: relCount 
                });
                setParsedData(extractedProjects);
                setStatus('complete');
            } catch (err) {
                console.error("Parsing error:", err);
                setStatus('error');
                alert("Failed to parse file. Ensure it is a valid P6 XML.");
            }
        };
        reader.readAsText(file);
    }, [file]);

    const handlePushToStaging = useCallback(() => {
        if (!file || parsedData.length === 0) return;

        dispatch({ 
            type: 'STAGING_INIT', 
            payload: { 
                type: 'Project',
                data: parsedData 
            } 
        });

        return { success: true };
    }, [file, parsedData, dispatch]);

    const reset = useCallback(() => {
        setStatus('idle');
        setFile(null);
        setParsedData([]);
    }, []);

    return {
        file,
        status,
        stats,
        handleFileUpload,
        runParser,
        handlePushToStaging,
        reset
    };
};