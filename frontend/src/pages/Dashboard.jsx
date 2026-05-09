import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/utils/AuthContext';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import { ArrowRight, Search, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ stats: {}, recentTickets: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground text-sm">Memuat dashboard...</div>;

  const { stats, recentTickets } = data;

  const showRequester = user?.role !== 'karyawan';
  const showTechnician = user?.role !== 'teknisi';
  const tableColSpan = 6 + (showRequester ? 1 : 0) + (showTechnician ? 1 : 0);

  const getTicketsForTab = (tab) => {
    if (!Array.isArray(recentTickets)) return [];
    if (tab === 'all') return recentTickets;
    return recentTickets.filter((t) => t.status === tab);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'open': return 'secondary';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-4">
        {user?.role === 'admin' ? (
          <>
            <StatCard title="Total Tiket" value={stats.total} />
            <StatCard title="Tiket Terbuka" value={stats.open} />
            <StatCard title="Sedang Diproses" value={stats.inProgress} />
            <StatCard title="Selesai" value={stats.resolved} />
          </>
        ) : user?.role === 'teknisi' ? (
          <>
            <StatCard title="Ditugaskan" value={stats.assigned} />
            <StatCard title="Sedang Diproses" value={stats.inProgress} />
            <StatCard title="Selesai" value={stats.resolved} />
            <StatCard title="Total Selesai" value={stats.resolved} /> {/* Filler for 4 columns if needed */}
          </>
        ) : (
          <>
            <StatCard title="Total Tiket Saya" value={stats.total} />
            <StatCard title="Tiket Terbuka" value={stats.open} />
            <StatCard title="Selesai" value={stats.resolved} />
            <div /> {/* Empty placeholder to maintain grid */}
          </>
        )}
      </div>

      {/* Analytics Chart Placeholder (Removed) */}

      {/* Data Table Section */}
      <Card className="border-border shadow-sm rounded-xl overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader className="border-b border-border bg-muted/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 space-y-0">
            <TabsList className="bg-transparent p-0 h-auto gap-4">
              <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-1.5 font-medium text-sm">Semua Tiket</TabsTrigger>
              <TabsTrigger value="open" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-1.5 font-medium text-sm">Open</TabsTrigger>
              <TabsTrigger value="in_progress" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-1.5 font-medium text-sm">Dalam Proses</TabsTrigger>
              <TabsTrigger value="resolved" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-1.5 font-medium text-sm">Selesai</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input type="text" placeholder="Cari..." className="pl-8 h-8 w-[150px] lg:w-[200px] text-xs bg-background" />
              </div>
              {user?.role !== 'teknisi' && (
                <Button size="sm" className="h-8 text-xs" asChild>
                  <Link to="/tickets/create">
                    <Plus className="mr-1 h-3.5 w-3.5" /> Tiket
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {['all', 'open', 'in_progress', 'resolved'].map((tab) => {
              const ticketsForTab = getTicketsForTab(tab);
              return (
              <TabsContent key={tab} value={tab} className="m-0 border-none p-0 outline-none">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="h-9 py-2 text-xs font-medium">Judul</TableHead>
                        <TableHead className="h-9 py-2 text-xs font-medium">Status</TableHead>
                        <TableHead className="h-9 py-2 text-xs font-medium">Prioritas</TableHead>
                        <TableHead className="h-9 py-2 text-xs font-medium">Kategori</TableHead>
                        {showRequester && <TableHead className="h-9 py-2 text-xs font-medium">Pemohon</TableHead>}
                        {showTechnician && <TableHead className="h-9 py-2 text-xs font-medium">Teknisi</TableHead>}
                        <TableHead className="h-9 py-2 text-xs font-medium">Tanggal</TableHead>
                        <TableHead className="h-9 py-2 text-xs font-medium text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(ticketsForTab.length === 0) ? (
                        <TableRow>
                          <TableCell colSpan={tableColSpan} className="h-24 text-center text-muted-foreground text-sm">
                            Belum ada tiket
                          </TableCell>
                        </TableRow>
                      ) : (
                        ticketsForTab.map(ticket => (
                          <TableRow key={ticket.id} className="border-border">
                            <TableCell className="py-2.5">
                              <div className="font-semibold text-primary text-xs mb-1">
                                {ticket.ticket_number || `#${ticket.id}`}
                              </div>
                              <div className="font-medium max-w-[200px] truncate text-sm text-foreground" title={ticket.title}>
                                {ticket.title}
                              </div>
                            </TableCell>
                            <TableCell className="py-2.5">
                              <Badge variant={getStatusBadgeVariant(ticket.status)} className="uppercase text-[9px] tracking-wider font-semibold">
                                {ticket.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2.5">
                              <Badge variant="outline" className="capitalize text-[10px] font-normal tracking-wide text-muted-foreground">
                                {ticket.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2.5 text-xs text-muted-foreground">{ticket.category}</TableCell>
                            {showRequester && <TableCell className="py-2.5 text-xs text-foreground">{ticket.requester}</TableCell>}
                            {showTechnician && <TableCell className="py-2.5 text-xs text-muted-foreground">{ticket.technician || '-'}</TableCell>}
                            <TableCell className="py-2.5 text-xs text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="py-2.5 text-right">
                              <Button variant="ghost" size="sm" asChild className="h-7 text-xs px-2 hover:bg-muted">
                                <Link to={`/tickets/${ticket.id}`}>Detail</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              );
            })}
          </CardContent>
          <div className="p-3 border-t border-border bg-muted/20 text-center">
            <Link to="/tickets" className="text-xs text-primary hover:underline font-medium inline-flex items-center">
              Lihat Semua Tiket <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <Card className="shadow-sm border-border rounded-xl">
    <CardHeader className="pb-2 pt-5 px-5">
      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
    </CardHeader>
    <CardContent className="px-5 pb-5">
      <div className="text-3xl font-bold tracking-tight text-foreground">{value || 0}</div>
    </CardContent>
  </Card>
);

export default Dashboard;
