
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ComponentWorkbench: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/design-system');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-full text-slate-400">
      Redirecting to Pattern Library...
    </div>
  );
};

export default ComponentWorkbench;
