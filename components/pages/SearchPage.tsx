
import React from 'react';
import { CommandPalette } from '../common/CommandPalette';
import { useNavigate } from 'react-router-dom';

const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    
    // We render the CommandPalette in 'modal' mode but triggered immediately
    // onClose simply navigates back to previous history state
    return (
        <CommandPalette 
            isOpen={true} 
            onClose={() => navigate(-1)} 
            onNavigate={(tab, id) => {
                if (id) navigate(`/projectWorkspace/${id}`);
                else navigate(`/${tab}`);
            }} 
        />
    );
};

export default SearchPage;
