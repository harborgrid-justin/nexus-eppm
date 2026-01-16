
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { LayoutTemplate, ArrowRight, Monitor, Smartphone, FileText, PieChart, Activity, Shield } from 'lucide-react';
import { PageLayout } from './layout/standard/PageLayout';
import { PanelContainer } from './layout/standard/PanelContainer';
import { EmptyGrid } from './common/EmptyGrid';
import { useI18n } from '../context/I18nContext';

// Import templates (lazy load in real app, simplified here)
// We are just displaying cards that *would* load these templates
const TEMPLATE_CATEGORIES = [
    {
        id: 'dashboards',
        title: 'Executive Dashboards',
        icon: PieChart,
        templates: [
            { id: 'exec_overview', title: 'Executive Overview', desc: 'High-level portfolio KPIs and trend analysis.' },
            { id: 'proj_health', title: 'Project Health Monitor', desc: 'Detailed status tracking for single initiatives.' },
            { id: 'personal', title: 'Personal Workspace', desc: 'Individual contributor task and time tracking.' }
        ]
    },
    {
        id: 'financial',
        title: 'Financial & Cost',
        icon: DollarIcon,
        templates: [
            { id: 'invoice_proc', title: 'Invoice Processing', desc: 'AP workflow with approval gates.' },
            { id: 'cash_flow', title: 'Cash Flow Modeling', desc: 'Liquidity forecasting and burn rate analysis.' },
            { id: 'budget_alloc', title: 'Budget Allocation', desc: 'Departmental funding distribution.' }
        ]
    },
    {
        id: 'operational',
        title: 'Operational',
        icon: Activity,
        templates: [
            { id: 'daily_log', title: 'Daily Site Journal', desc: 'Field reporting for construction superintendents.' },
            { id: 'inventory', title: 'Inventory Grid', desc: 'Stock tracking and reorder management.' },
            { id: 'system_health', title: 'Platform Health', desc: 'IT infrastructure monitoring dashboard.' }
        ]
    },
    {
        id: 'ux',
        title: 'User Experience',
        icon: Monitor,
        templates: [
            { id: 'mobile_prev', title: 'Mobile App Shell', desc: 'Responsive layout for field devices.' },
            { id: 'kiosk', title: 'Kiosk Mode', desc: 'Simplified touch interface for shop floors.' },
            { id: 'file_exp', title: 'File Explorer', desc: 'Document management interface pattern.' }
        ]
    }
];

function DollarIcon(props: any) { return <span {...props}>$</span> } // Quick fix if DollarSign isn't imported from lucide in this scope context easily without expanding imports list significantly. Actually let's just use LayoutTemplate.

const TemplateGallery: React.FC = () => {
    const theme = useTheme();
    const { t } = useI18n();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredCategories = selectedCategory === 'All' 
        ? TEMPLATE_CATEGORIES 
        : TEMPLATE_CATEGORIES.filter(c => c.id === selectedCategory);

    return (
        <PageLayout
            title={t('nav.templates', 'Template Gallery')}
            subtitle="Pre-configured layouts for rapid deployment."
            icon={LayoutTemplate}
        >
            <PanelContainer>
                <div className="flex flex-col h-full bg-slate-50/50">
                    {/* Filter Bar */}
                    <div className={`p-4 border-b ${theme.colors.border} flex gap-2 bg-white sticky top-0 z-10`}>
                         <button 
                            onClick={() => setSelectedCategory('All')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === 'All' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                            All Categories
                        </button>
                        {TEMPLATE_CATEGORIES.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat.id ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                                {cat.title}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
                        <div className="space-y-12">
                            {filteredCategories.map(cat => (
                                <div key={cat.id} className="space-y-4">
                                    <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                                        <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-nexus-600">
                                            <cat.icon size={20} />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{cat.title}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {cat.templates.map(tmpl => (
                                            <div key={tmpl.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-nexus-300 transition-all group cursor-pointer flex flex-col h-48">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-900 mb-2 group-hover:text-nexus-700 transition-colors">{tmpl.title}</h4>
                                                    <p className="text-xs text-slate-500 leading-relaxed">{tmpl.desc}</p>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                                                    <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">v1.0</span>
                                                    <button className="text-xs font-bold text-nexus-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                        Preview <ArrowRight size={12}/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PanelContainer>
        </PageLayout>
    );
};

export default TemplateGallery;
