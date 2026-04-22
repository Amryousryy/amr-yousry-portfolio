"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Mail, 
  MessageSquare, 
  Trash2, 
  Zap, 
  Phone,
  User,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import AdminLoadingSkeleton from "@/components/admin/AdminLoadingSkeleton";
import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminEmptyState from "@/components/admin/AdminEmptyState";

export default function LeadsPage() {
  const queryClient = useQueryClient();

  const { data: leadsResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead removed");
    }
  });

  // Safe data extraction
  const leads = Array.isArray(leadsResponse) ? leadsResponse : 
                Array.isArray(leadsResponse?.data) ? leadsResponse.data : [];

  const getLeadsWithType = (type: string) => {
    return (leads ?? []).filter((l: any) => l.offerType === type);
  };

  const getLeadsThisWeek = () => {
    return (leads ?? []).filter((l: any) => {
      try {
        const d = new Date(l.createdAt);
        const now = new Date();
        return (now.getTime() - d.getTime()) < (7 * 24 * 60 * 60 * 1000);
      } catch {
        return false;
      }
    });
  };

  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }

  if (isError) {
    return <AdminErrorState message="Failed to load leads" onRetry={() => refetch()} />;
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="space-y-12">
        <header>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">Growth Command</h1>
          <p className="text-foreground/40 pixel-text text-[10px] uppercase tracking-widest">Lead Generation & Conversion Pipeline</p>
        </header>
        <AdminEmptyState 
          title="No Leads Yet"
          description="Leads from the contact form will appear here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">Growth Command</h1>
        <p className="text-foreground/40 pixel-text text-[10px] uppercase tracking-widest">Lead Generation & Conversion Pipeline</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Leads", value: leads?.length || 0, icon: User, color: "text-blue-500" },
          { label: "Audit Requests", value: getLeadsWithType('free_audit').length, icon: Zap, color: "text-accent" },
          { label: "New This Week", value: getLeadsThisWeek().length, icon: Filter, color: "text-green-500" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-primary/5 border border-primary/10 pixel-border">
             <div className="flex items-center justify-between mb-4">
                <stat.icon className={stat.color} size={20} />
                <span className="text-3xl font-display font-bold">{stat.value}</span>
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 border border-primary/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary/10 border-b border-primary/10">
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-accent">Prospect</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-accent">Interest</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-accent">Offer</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-accent">Date</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-accent text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((lead: any) => (
              <tr key={lead._id} className="border-b border-primary/5 hover:bg-white/5 transition-colors group">
                <td className="p-6">
                   <p className="text-sm font-bold uppercase tracking-tight">{lead.name || "N/A"}</p>
                   <p className="text-[10px] text-foreground/40">{lead.email || "N/A"}</p>
                   {lead.phone && <p className="text-[8px] text-foreground/20">{lead.phone}</p>}
                </td>
                <td className="p-6">
                   <span className="px-3 py-1 bg-primary/20 text-foreground/60 text-[8px] font-bold uppercase tracking-widest">
                     {lead.projectType || "N/A"}
                   </span>
                </td>
                <td className="p-6">
                   {lead.offerType === 'free_audit' ? (
                     <div className="flex items-center space-x-2 text-accent">
                        <Zap size={12} fill="currentColor" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Free Audit</span>
                     </div>
                   ) : (
                     <span className="text-[9px] text-foreground/20 uppercase font-bold tracking-widest">General</span>
                   )}
                </td>
                <td className="p-6">
                   <p className="text-[10px] text-foreground/40 uppercase">
                     {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "N/A"}
                   </p>
                </td>
                <td className="p-6 text-right">
                   <div className="flex items-center justify-end space-x-4">
                      <a href={`mailto:${lead.email}`} className="p-2 text-foreground/40 hover:text-accent transition-colors">
                         <Mail size={16} />
                      </a>
                      {lead.phone && (
                        <a href={`https://wa.me/${lead.phone}`} target="_blank" className="p-2 text-foreground/40 hover:text-green-500 transition-colors">
                           <MessageSquare size={16} />
                        </a>
                      )}
                      <button className="p-2 text-foreground/20 hover:text-red-500 transition-colors">
                         <Trash2 size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}