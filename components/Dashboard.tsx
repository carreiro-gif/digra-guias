import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Guia, StatusServico } from '../types';

interface DashboardProps {
  guias: Guia[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Dashboard: React.FC<DashboardProps> = ({ guias }) => {
  
  const statsComarca = useMemo(() => {
    const counts: Record<string, number> = {};
    guias.forEach(g => {
      const comarca = g.orgaoSnapshot.comarca;
      counts[comarca] = (counts[comarca] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [guias]);

  const statsServico = useMemo(() => {
    const counts: Record<string, number> = {};
    guias.forEach(g => {
      g.itens.forEach(item => {
        counts[item.descricao] = (counts[item.descricao] || 0) + item.quantidade;
      });
    });
    // Top 5 services
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [guias]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Guias por Comarca */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Guias Emitidas por Comarca</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statsComarca}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statsComarca.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Top Serviços */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Serviços Mais Solicitados</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsServico} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-80">Total de Guias</p>
          <p className="text-3xl font-bold">{guias.length}</p>
        </div>
        <div className="bg-emerald-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-80">Itens Produzidos</p>
          <p className="text-3xl font-bold">
            {guias.reduce((acc, g) => acc + g.itens.reduce((iAcc, i) => iAcc + i.quantidade, 0), 0)}
          </p>
        </div>
        <div className="bg-slate-700 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-80">Valor Total Estimado</p>
          <p className="text-3xl font-bold">
            R$ {guias.reduce((acc, g) => acc + g.itens.reduce((iAcc, i) => iAcc + (i.valorUnitario * i.quantidade), 0), 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};