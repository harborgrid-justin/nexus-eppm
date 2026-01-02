
import React from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Check, AlertTriangle, Info, Search, Palette, Type } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ComponentWorkbench: React.FC = () => {
  const theme = useTheme();

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} overflow-auto h-full`}>
      <h1 className={theme.typography.h1}>Component Workbench</h1>
      <p className={`${theme.colors.text.secondary} mb-8`}>Visual regression suite for core design system atoms. Current Mode: <strong className="uppercase">{theme.mode}</strong></p>

      <div className="space-y-8 pb-20">
        
        {/* Colors */}
        <section>
             <h3 className={`text-lg font-bold mb-4 ${theme.colors.text.primary} flex items-center gap-2`}><Palette size={18}/> Semantic Palette</h3>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 {[
                     { label: 'Success', token: theme.colors.semantic.success },
                     { label: 'Warning', token: theme.colors.semantic.warning },
                     { label: 'Danger', token: theme.colors.semantic.danger },
                     { label: 'Info', token: theme.colors.semantic.info },
                     { label: 'Neutral', token: theme.colors.semantic.neutral },
                 ].map((c) => (
                     <div key={c.label} className={`p-4 rounded-xl border ${c.token.bg} ${c.token.border}`}>
                         <span className={`font-bold ${c.token.text}`}>{c.label}</span>
                         <div className="mt-2 text-xs opacity-70">
                             <div className={c.token.text}>Text</div>
                             <div className={c.token.border}>Border</div>
                             <div className={c.token.bg}>Background</div>
                         </div>
                     </div>
                 ))}
             </div>
        </section>

        {/* Buttons */}
        <section>
          <h3 className={`text-lg font-bold mb-4 ${theme.colors.text.primary}`}>Buttons</h3>
          <div className={`flex flex-wrap gap-4 items-center p-6 border rounded-xl ${theme.colors.surface} ${theme.colors.border}`}>
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

        {/* Badges */}
        <section>
          <h3 className={`text-lg font-bold mb-4 ${theme.colors.text.primary}`}>Badges</h3>
          <div className={`flex flex-wrap gap-4 items-center p-6 border rounded-xl ${theme.colors.surface} ${theme.colors.border}`}>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="success" icon={Check}>Success</Badge>
            <Badge variant="warning" icon={AlertTriangle}>Warning</Badge>
            <Badge variant="danger" icon={AlertTriangle}>Danger</Badge>
            <Badge variant="info" icon={Info}>Info</Badge>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h3 className={`text-lg font-bold mb-4 ${theme.colors.text.primary}`}>Inputs</h3>
          <div className={`grid grid-cols-2 gap-4 p-6 border rounded-xl ${theme.colors.surface} ${theme.colors.border}`}>
            <Input placeholder="Default Input" />
            <Input placeholder="Search Input" isSearch />
            <Input placeholder="Disabled Input" disabled />
            <Input placeholder="With Icon" icon={Info} />
          </div>
        </section>

        {/* Cards */}
        <section>
          <h3 className={`text-lg font-bold mb-4 ${theme.colors.text.primary}`}>Cards</h3>
          <div className="grid grid-cols-2 gap-4">
             <Card className="p-6">
                <h4 className={`font-bold ${theme.colors.text.primary}`}>Standard Card</h4>
                <p className={`text-sm ${theme.colors.text.secondary}`}>This is basic content inside a card component.</p>
             </Card>
             <Card className="p-6" onClick={() => alert('Clicked')}>
                <h4 className={`font-bold ${theme.colors.text.primary}`}>Interactive Card</h4>
                <p className={`text-sm ${theme.colors.text.secondary}`}>Hover over me to see the interaction state.</p>
             </Card>
          </div>
        </section>
        
        {/* Typography */}
        <section>
            <h3 className={`text-lg font-bold mb-4 ${theme.colors.text.primary} flex items-center gap-2`}><Type size={18}/> Typography</h3>
            <div className={`p-6 border rounded-xl ${theme.colors.surface} ${theme.colors.border} space-y-4`}>
                <div><span className="text-xs text-slate-400 uppercase tracking-widest">H1 Heading</span><h1 className={theme.typography.h1}>The quick brown fox jumps over the lazy dog</h1></div>
                <div><span className="text-xs text-slate-400 uppercase tracking-widest">H2 Heading</span><h2 className={theme.typography.h2}>The quick brown fox jumps over the lazy dog</h2></div>
                <div><span className="text-xs text-slate-400 uppercase tracking-widest">H3 Heading</span><h3 className={theme.typography.h3}>The quick brown fox jumps over the lazy dog</h3></div>
                <div><span className="text-xs text-slate-400 uppercase tracking-widest">Body Text</span><p className={theme.typography.body}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p></div>
                <div><span className="text-xs text-slate-400 uppercase tracking-widest">Label</span><p className={theme.typography.label}>Form Label Example</p></div>
                <div><span className="text-xs text-slate-400 uppercase tracking-widest">Monospace</span><p className={theme.typography.mono}>API_KEY_EXAMPLE_12345</p></div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default ComponentWorkbench;
