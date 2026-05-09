"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2, Loader2, GripVertical, Check, X, Edit2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FilterService } from "@/lib/api-client";
import { 
  filterCreateSchema, 
  filterUpdateSchema,
  FilterCreateInput, 
  filterDefaultValues, 
  createFilterFormValues,
} from "@/lib/validation/filter";
import { normalizeSlug } from "@/lib/validation/shared";
import { toast } from "sonner";
import { Filter } from "@/types";
import AdminLoadingSkeleton from "@/components/admin/AdminLoadingSkeleton";
import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminEmptyState from "@/components/admin/AdminEmptyState";

type FormData = FilterCreateInput;

function getFieldError(errors: FieldErrors<FormData>, path: string): string | undefined {
  const parts = path.split(".");
  let current: any = errors;
  for (const part of parts) {
    if (current === undefined) return undefined;
    current = current[part];
  }
  return current?.message as string | undefined;
}

function getString(value: string | { en: string; ar: string } | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.en || "";
}

export default function FiltersManagerPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(editingId ? filterUpdateSchema : filterCreateSchema),
    defaultValues: filterDefaultValues,
  });

  const watchedName = watch("name");
  const watchedSlug = watch("slug");

  useEffect(() => {
    if (watchedName && !editingId && !watchedSlug) {
      setValue("slug", normalizeSlug(watchedName));
    }
  }, [watchedName, editingId, setValue, watchedSlug]);

  const { data: filters, isLoading, isError, refetch } = useQuery({
    queryKey: ["filters", "admin"],
    queryFn: () => FilterService.getAll(true),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => FilterService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filters"] });
      toast.success("Filter created!");
      setIsAdding(false);
      reset(filterDefaultValues);
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Filter> }) => FilterService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filters"] });
      toast.success("Filter updated");
      setEditingId(null);
      reset(filterDefaultValues);
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
    mutationFn: ({ id, data }: { id: string; data: Partial<Filter> }) => FilterService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["filters"] }),
    onError: (error: Error) => toast.error(error.message)
  });

  const onSubmit = (data: FormData) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (filter: Filter) => {
    setEditingId(filter._id);
    setIsAdding(true);
    reset({
      name: filter.name,
      slug: filter.slug,
      displayOrder: filter.displayOrder,
      isActive: filter.isActive,
    });
  };

  const filtersData = Array?.isArray(filters?.data) ? filters.data : [];

  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }

  if (isError) {
    return <AdminErrorState message="Failed to load filters" onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 uppercase tracking-tighter">Filter Manager</h1>
          <p className="text-foreground/50 pixel-text text-xs uppercase tracking-widest">Manage project categories</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => {
              setEditingId(null);
              setIsAdding(true);
              reset(filterDefaultValues);
            }}
            className="flex items-center space-x-3 px-8 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-transform"
          >
            <Plus size={16} />
            <span>Add New Filter</span>
          </button>
        )}
      </header>

      {isAdding && (
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-primary/10 border-2 border-accent animate-in slide-in-from-top duration-300">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase text-accent">Name <span className="text-red-500">*</span></label>
               <input 
                 {...register("name")}
                 className="w-full bg-background border border-primary/20 p-3 outline-none focus:border-accent text-sm"
                 placeholder="Filter name"
               />
               {getFieldError(errors, "name") && (
                 <p className="text-[10px] text-red-500">{getFieldError(errors, "name")}</p>
               )}
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase text-accent">Slug <span className="text-red-500">*</span></label>
               <input 
                 {...register("slug")}
                 className="w-full bg-background border border-primary/20 p-3 outline-none focus:border-accent text-sm"
                 placeholder="filter-slug"
               />
               {getFieldError(errors, "slug") && (
                 <p className="text-[10px] text-red-500">{getFieldError(errors, "slug")}</p>
               )}
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase text-accent">Order</label>
               <input 
                 type="number"
                 {...register("displayOrder", { valueAsNumber: true })}
                 className="w-full bg-background border border-primary/20 p-3 outline-none focus:border-accent text-sm"
                 placeholder="0"
               />
             </div>
             <div className="flex gap-4">
               <button 
                 type="submit" 
                 disabled={createMutation.isPending || updateMutation.isPending || isSubmitting}
                 className="flex-1 py-3 bg-accent text-background font-bold uppercase text-xs disabled:opacity-50"
               >
                 {createMutation.isPending || updateMutation.isPending || isSubmitting ? <Loader2 className="animate-spin inline" size={14} /> : "Save"}
               </button>
               <button 
                 type="button" 
                 onClick={() => { setIsAdding(false); setEditingId(null); reset(filterDefaultValues); }} 
                 className="px-4 py-3 border border-primary/20 text-foreground/40 hover:text-white"
               >
                 Cancel
               </button>
             </div>
           </div>
        </form>
      )}

      {filtersData.length === 0 ? (
        <AdminEmptyState 
          title="No Filters Yet"
          description="Create your first filter to categorize projects."
          actionLabel="Add Filter"
          actionHref="#"
          onActionClick={() => setIsAdding(true)}
        />
      ) : (
        <div className="bg-primary/5 border border-primary/10 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/10 bg-primary/5">
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40">Order</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40">Name</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40">Slug</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40 text-center">Status</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtersData.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((filter: Filter) => (
                <tr key={filter._id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <GripVertical size={14} className="text-foreground/20" />
                      <span className="text-xs font-mono">{filter.displayOrder || 0}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-bold">{getString(filter.name) || "N/A"}</span>
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
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(filter)}
                        className="p-2 text-foreground/20 hover:text-accent transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => { if(confirm("Delete this category?")) deleteMutation.mutate(filter._id); }}
                        className="p-2 text-foreground/20 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}