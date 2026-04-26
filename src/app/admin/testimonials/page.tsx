"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { TestimonialService } from "@/lib/api-client";
import { DataTable } from "@/components/admin/DataTable";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star,
  ArrowLeft,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface TestimonialRow {
  _id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  projectSlug?: string;
  isFeatured: boolean;
  status: "draft" | "published";
  displayOrder: number;
  createdAt: Date;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[9px] px-2 py-0.5 font-bold uppercase ${
      status === "published" 
        ? "bg-emerald-500/20 text-emerald-400" 
        : "bg-yellow-500/20 text-yellow-400"
    }`}>
      {status}
    </span>
  );
}

function FeaturedBadge() {
  return (
    <div className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 bg-yellow-500/20 text-yellow-400 font-bold uppercase">
      <Star size={10} fill="currentColor" />
      Featured
    </div>
  );
}

export default function TestimonialsPage() {
  const queryClient = useQueryClient();

  const { data: testimonials, isLoading, refetch } = useQuery({
    queryKey: ["testimonials", "admin"],
    queryFn: () => TestimonialService.getAll(true),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => TestimonialService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete");
    }
  });

  const columns: ColumnDef<TestimonialRow>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => (
        <div className="text-foreground/60">
          {row.original.role}, {row.original.company}
        </div>
      ),
    },
    {
      accessorKey: "quote",
      header: "Quote",
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-foreground/60">
          "{row.original.quote}"
        </div>
      ),
    },
    {
      accessorKey: "isFeatured",
      header: "Featured",
      cell: ({ row }) => row.original.isFeatured ? <FeaturedBadge /> : null,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "displayOrder",
      header: "Order",
      cell: ({ row }) => (
        <span className="text-foreground/40">{row.original.displayOrder}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/testimonials/edit/${item._id}`}
              className="p-2 hover:text-accent transition-colors"
            >
              <Edit2 size={14} />
            </Link>
            <button
              onClick={() => {
                if (confirm("Delete this testimonial?")) {
                  deleteMutation.mutate(item._id);
                }
              }}
              className="p-2 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="p-2 hover:text-accent transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold uppercase tracking-tighter">
                Testimonials
              </h1>
              <p className="text-foreground/50 pixel-text text-xs uppercase tracking-widest">
                Manage client testimonials
              </p>
            </div>
          </div>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-2 px-6 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-transform"
        >
          <Plus size={16} />
          Add Testimonial
        </Link>
      </header>

      <DataTable
        columns={columns}
        data={testimonials?.data || []}
        isLoading={isLoading}
      />
    </div>
  );
}