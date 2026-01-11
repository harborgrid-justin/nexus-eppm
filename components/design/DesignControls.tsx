
import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Check, AlertTriangle, Info, Sparkles } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

export const DesignControls = () => {
    return (
        <div className="space-y-12 animate-fade-in">
            <SectionHeading title="Buttons & Triggers" icon={Sparkles} count="CTL-01 to CTL-20" />
            
            <DemoContainer className="space-y-4">
                <ComponentLabel id="CTL-01" name="Buttons" />
                <div className="flex flex-wrap gap-4 items-center p-4 border rounded-lg bg-slate-50/50">
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
            </DemoContainer>

            <DemoContainer className="space-y-4">
                <ComponentLabel id="CTL-02" name="Badges" />
                <div className="flex flex-wrap gap-4 items-center p-4 border rounded-lg bg-slate-50/50">
                    <Badge variant="neutral">Neutral</Badge>
                    <Badge variant="success" icon={Check}>Success</Badge>
                    <Badge variant="warning" icon={AlertTriangle}>Warning</Badge>
                    <Badge variant="danger" icon={AlertTriangle}>Danger</Badge>
                    <Badge variant="info" icon={Info}>Info</Badge>
                </div>
            </DemoContainer>
        </div>
    );
};
