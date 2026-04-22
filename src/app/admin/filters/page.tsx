"use client";

import React, { useState } from "react";
import { Plus, Save, Trash2, Loader2, GripVertical, Check, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FilterService } from "@/lib/api-client";
import { filterSchema } from "@/lib/validations";
import { toast } from "sonner";
import { Filter } from "@/types";
import AdminLoadingSkeleton from "@/components/admin/AdminLoadingSkeleton";
import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminEmptyState from "@/components/admin/AdminEmptyState";

export default function FiltersManagerPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newFilter, setNewFilter] = useState({
    name: { en: "", ar: "" },
    slug: "",
    displayOrder: 0,
    isActive: true
  });

  const { data: filters, isLoading, isError, refetch } = useQuery({
    queryKey: ["filters", "admin"],
    queryFn: () => FilterService.getAll(true),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => FilterService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filters"] });
      toast.success("Filter created!");
      setIsAdding(false);
      setNewFilter({ name: { en: "", ar: "" }, slug: "", displayOrder: 0, isActive: true });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => FilterService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filters"] });
      toast.success("Filter deleted");
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Filter> }) => FilterService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["filters"] }),
    onError: (error: Error) => toast.error(error.message)
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newFilter.name.en.toLowerCase().replace(/\s+/g, "-");
    const validation = filterSchema.safeParse({ ...newFilter, slug });
    if (!validation.success) {
      toast.error("Please fill all fields.");
      return;
    }
    createMutation.mutate({ ...newFilter, slug });
  };

  // Safe data extraction
  const filtersData = Array.isArray(filters?.data) ? filters.data : [];

  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }

  if (isError) {
    return <AdminErrorState message="Failed to load filters" onRetry={() => refetch()} />;
  }

  if (filtersData.length === 0) {
    return (
      <div className="space-y-12">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 uppercase tracking-tighter">Filter Manager</h1>
            <p className="text-foreground/50 pixel-text text-xs uppercase tracking-widest">Manage project categories</p>
          </div>
        </header>
        <AdminEmptyState 
          title="No Filters Yet"
          description="Create your first filter to categorize projects."
          actionLabel="Add Filter"
          actionHref="#"
        />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 uppercase tracking-tighter">Filter Manager</h1>
          <p className="text-foreground/50 pixel-text text-xs uppercase tracking-widest">Manage project categories</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-3 px-8 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-transform"
        >
          <Plus size={16} />
          <span>Add New Filter</span>
        </button>
      </header>

      {isAdding && (
        <div className="p-8 bg-primary/10 border-2 border-accent animate-in slide-in-from-top duration-300">
           <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase text-accent">English Name</label>
               <input 
                 required
                 value={newFilter.name.en}
                 onChange={(e) => setNewFilter({ ...newFilter, name: { ...newFilter.name, en: e.target.value } })}
                 className="w-full bg-background border border-primary/20 p-3 outline-none focus:border-accent text-sm"
               />
             </div>
             <div className="space-y-2 text-right" dir="rtl">
               <label className="text-[10px] font-bold uppercase text-accent" dir="ltr">Arabic Name</label>
               <input 
                 required
                 value={newFilter.name.ar}
                 onChange={(e) => setNewFilter({ ...newFilter, name: { ...newFilter.name, ar: e.target.value } })}
                 className="w-full bg-background border border-primary/20 p-3 outline-none focus:border-accent text-sm font-sans"
               />
             </div>
             <div className="flex gap-4">
               <button type="submit" className="flex-1 py-3 bg-accent text-background font-bold uppercase text-xs">Save</button>
               <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-3 border border-primary/20 text-foreground/40 hover:text-white">Cancel</button>
             </div>
          </form>
        </div>
      )}

      <div className="bg-primary/5 border border-primary/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-primary/10 bg-primary/5">
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40">Order</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40">Name (EN / AR)</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40">Slug</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40 text-center">Status</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtersData.map((filter: Filter, index: number) => (
              <tr key={filter._id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <GripVertical size={14} className="text-foreground/20" />
                    <span className="text-xs font-mono">{index + 1}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{filter.name?.en || "N/A"}</span>
                    <span className="text-xs text-foreground/40 font-sans">{filter.name?.ar || "N/A"}</span>
                  </div>
                </td>
                <td className="p-6 text-xs text-accent font-mono">{filter.slug || "N/A"}</td>
                <td className="p-6 text-center">
                  <button 
                    onClick={() => toggleMutation.mutate({ id: filter._id, data: { isActive: !filter.isActive } })}
                    className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase ${filter.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                  >
                    {filter.isActive ? <Check size={10} /> : <X size={10} />}
                    <span>{filter.isActive ? 'Active' : 'Disabled'}</span>
                  </button>
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={() => { if(confirm("Delete this category?")) deleteMutation.mutate(filter._id); }}
                    className="p-2 text-foreground/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}