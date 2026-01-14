import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { MapPin, Plus, Save, Globe } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';
import { SidePanel } from '../ui/SidePanel';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

const LocationSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const { t } = useI18n();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingLoc, setEditingLoc] = useState<any>(null);

    const handleSave = () => {
        if (!editingLoc?.name) return;
        const payload = { ...editingLoc, id: editingLoc.id || generateId('LOC') };
        dispatch({ type: editingLoc.id ? 'ADMIN_UPDATE_LOCATION' : 'ADMIN_ADD_LOCATION', payload });
        setIsPanelOpen(false);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className={`p-6 rounded-2xl bg-slate-900 text-white flex justify-between items-center shadow-xl relative overflow-hidden`}>
                <div className="relative z-10">
                    <h4 className="text-xl font-black uppercase tracking-tighter">{t('loc.registry', 'Global Site Registry')}</h4>
                    <p className="text-slate-400 text-sm mt-1">{t('loc.subtitle', 'Geographical master data for field telemetry.')}</p>
                </div>
                <Button size="md" icon={Plus} onClick={() => { setEditingLoc({}); setIsPanelOpen(true); }}>{t('loc.add', 'Register Site')}</Button>
                <Globe size={160} className="absolute -right-8 -bottom-8 opacity-5 text-white pointer-events-none rotate-12" />
            </div>

            <div className={`flex-1 overflow-auto rounded-xl border ${theme.colors.border} bg-white shadow-sm`}>
                {state.locations.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                            <tr>
                                <th className={theme.components.table.header}>{t('common.name', 'Site Name')}</th>
                                <th className={theme.components.table.header}>{t('common.region', 'Region')}</th>
                                <th className={theme.components.table.header}>{t('common.topology', 'Topology')}</th>
                                <th className={theme.components.table.header}></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {state.locations.map(loc => (
                                <tr key={loc.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <MapPin size={16} className="text-slate-300 group-hover:text-nexus-600" />
                                        <span className="text-sm font-bold text-slate-800">{loc.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{loc.city}, {loc.country}</td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{loc.coordinates ? `${loc.coordinates.lat}, ${loc.coordinates.lng}` : 'N/A'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => { setEditingLoc(loc); setIsPanelOpen(true); }} className="text-slate-400 hover:text-nexus-600 transition-colors opacity-0 group-hover:opacity-100"><Plus size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyGrid title={t('loc.empty', 'No Sites Defined')} description={t('loc.empty_desc', 'Register geographical endpoints.')} icon={MapPin} onAdd={() => setIsPanelOpen(true)} />
                )}
            </div>

            <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} title={t('loc.edit', 'Site Definition')} footer={<><Button variant="secondary" onClick={() => setIsPanelOpen(false)}>{t('common.cancel', 'Cancel')}</Button><Button onClick={handleSave} icon={Save}>{t('common.save', 'Save')}</Button></>}>
                <div className="space-y-4">
                    <Input label={t('common.name', 'Name')} value={editingLoc?.name} onChange={e => setEditingLoc({...editingLoc, name: e.target.value})} />
                    <Input label={t('common.city', 'City')} value={editingLoc?.city} onChange={e => setEditingLoc({...editingLoc, city: e.target.value})} />
                </div>
            </SidePanel>
        </div>
    );
};
export default LocationSettings;