import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectCreatePage: React.FC = () => {
    const navigate = useNavigate();
    
    // Redirect to project list with create mode active, or handle as standalone page
    // Since ProjectList handles the wizard, we redirect there.
    useEffect(() => {
        navigate('/projectList');
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-full text-slate-400">
            Redirecting to Project Wizard...
        </div>
    ); 
};

export default ProjectCreatePage;
