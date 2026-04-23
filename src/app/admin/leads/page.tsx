"use client";

import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader } from "@/components/admin/DataTable";
import { LeadService, LeadData } from "@/lib/api-client";
import { 
  Mail, 
  MessageSquare, 
  Trash2, 
  Zap, 
  Phone,
  User,
  Filter,
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "new", label: "New", icon: Clock, color: "text-blue-400" },
  { value: "contacted", label: "Contacted", icon: Mail, color: "text-yellow-400" },
  { value: "qualified", label: "Qualified", icon: CheckCircle, color: "text-green-400" },
  { value: "closed", label: "Closed", icon: XCircle, color: "text-foreground/40" },
];

function StatusBadge({ status }: { status: string }) {
  const option = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];
  return (
    <button
      className={`flex items-center gap-1.5 text-[9px] px-2 py-1 font-bold uppercase bg-primary/20 rounded-sm hover:bg-primary/30 transition-colors`}
    >
      <option.icon size={10} className={option.color} />
      {option.label}
    </button>
  );
}

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: leads, isLoading, refetch } = useQuery({
    queryKey: ["leads", page, limit, debouncedSearch, statusFilter],
    queryFn: () => LeadService.getAll({ 
      page, 
      limit, 
      search: debouncedSearch || undefined,
      status: statusFilter || undefined
    }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      LeadService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete lead");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead removed");
    }
  });

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    const timeout = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  const handlePaginationChange = useCallback((newPage: number, newLimit: number) => {
    setPage(newPage);
    setLimit(newLimit);
  }, []);

  const columns: ColumnDef<LeadData>[] = [
    {
      accessorKey: "name",
      header: "Lead",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-foreground/40">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.phone && (
            <a 
              href={`https://wa.me/${row.original.phone.replace(/\D/g, '')}`}
              target="_blank"
              className="flex items-center gap-1 text-xs text-green-400 hover:underline"
            >
              <Phone size={12} />
              {row.original.phone}
            </a>
          )}
        </div>
      ),
    },
    {
      accessorKey: "projectType",
      header: "Interest",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1 bg-primary/20 text-foreground/60 font-medium uppercase">
          {row.original.projectType}
        </span>
      ),
    },
    {
      accessorKey: "offerType",
      header: "Offer",
      cell: ({ row }) => row.original.offerType === "free_audit" ? (
        <div className="flex items-center gap-1 text-accent text-xs font-bold uppercase">
          <Zap size={12} fill="currentColor" />
          Free Audit
        </div>
      ) : (
        <span className="text-xs text-foreground/30 font-bold uppercase">General</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <select
          value={row.original.status}
          onChange={(e) => updateStatusMutation.mutate({ 
            id: row.original._id, 
            status: e.target.value 
          })}
          className="bg-primary/20 border border-primary/10 text-xs px-2 py-1 rounded-sm outline-none focus:border-accent"
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
      cell: ({ row }) => (
        <span className="text-xs text-foreground/50">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <a 
            href={`mailto:${row.original.email}`} 
            className="p-2 hover:bg-accent hover:text-background transition-colors rounded-sm"
            title="Send Email"
          >
            <Mail size={14} />
          </a>
          {row.original.phone && (
            <a 
              href={`https://wa.me/${row.original.phone.replace(/\D/g, '')}`}
              target="_blank"
              className="p-2 hover:bg-green-500 hover:text-white transition-colors rounded-sm"
              title="WhatsApp"
            >
              <MessageSquare size={14} />
            </a>
          )}
          <button 
            onClick={() => {
              if (window.confirm("Delete this lead?")) {
                deleteMutation.mutate(row.original._id);
              }
            }}
            className="p-2 hover:bg-red-500 hover:text-white transition-colors rounded-sm"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const leadsData = Array.isArray(leads?.data) ? leads.data : [];
  const meta = leads?.meta;
  const totalLeads = meta?.total || 0;

  const newCount = leadsData.filter(l => l.status === "new").length;
  const contactedCount = leadsData.filter(l => l.status === "contacted").length;
  const auditCount = leadsData.filter(l => l.offerType === "free_audit").length;

  return (
    <div className="space-y-6">
      <header>
        <Link href="/admin" className="flex items-center space-x-2 text-accent group mb-4">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="pixel-text text-[10px] uppercase">Dashboard</span>
        </Link>
        <h1 className="text-xl font-display font-bold uppercase tracking-tight">Growth Command</h1>
        <p className="text-foreground/40 pixel-text text-[10px] uppercase tracking-widest">Lead Generation & Conversion Pipeline</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-blue-400" />
            <span className="text-2xl font-display font-bold">{totalLeads}</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Total Leads</p>
        </div>
        <div className="p-4 bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-blue-400" />
            <span className="text-2xl font-display font-bold">{newCount}</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">New</p>
        </div>
        <div className="p-4 bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-accent" />
            <span className="text-2xl font-display font-bold">{auditCount}</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Audits</p>
        </div>
        <div className="p-4 bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} className="text-yellow-400" />
            <span className="text-2xl font-display font-bold">{contactedCount}</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Contacted</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={leadsData}
        meta={meta}
        onPaginationChange={handlePaginationChange}
        pageSize={limit}
        isLoading={isLoading}
        searchPlaceholder="Search leads..."
        onSearchChange={handleSearch}
        searchValue={search}
      />
    </div>
  );
}