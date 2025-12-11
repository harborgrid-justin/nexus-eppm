
import React from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Check, AlertTriangle, Info, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ComponentWorkbench: React.FC = () => {
  const theme = useTheme();

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} overflow-auto`}>
      <h1 className={theme.typography.h1}>Component Workbench</h1>
      <p className="text-slate-500 mb-8">Visual regression suite for core design system atoms.</p>

      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-bold mb-4">Buttons</h3>
          <div className="flex flex-wrap gap-4 items-center p-6 border rounded-xl bg-white">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" icon={Check}>With Icon</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">Badges</h3>
          <div className="flex flex-wrap gap-4 items-center p-6 border rounded-xl bg-white">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="success" icon={Check}>Success</Badge>
            <Badge variant="warning" icon={AlertTriangle}>Warning</Badge>
            <Badge variant="danger" icon={AlertTriangle}>Danger</Badge>
            <Badge variant="info" icon={Info}>Info</Badge>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">Inputs</h3>
          <div className="grid grid-cols-2 gap-4 p-6 border rounded-xl bg-white">
            <Input placeholder="Default Input" />
            <Input placeholder="Search Input" isSearch />
            <Input placeholder="Disabled Input" disabled />
            <Input placeholder="With Icon" icon={Info} />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">Cards</h3>
          <div className="grid grid-cols-2 gap-4">
             <Card className="p-6">
                <h4 className="font-bold">Standard Card</h4>
                <p className="text-sm text-slate-500">This is basic content inside a card component.</p>
             </Card>
             <Card className="p-6" onClick={() => alert('Clicked')}>
                <h4 className="font-bold">Interactive Card</h4>
                <p className="text-sm text-slate-500">Hover over me to see the interaction state.</p>
             </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ComponentWorkbench;
