"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ListSectionEditor<T extends { id: string }>({
  title,
  items,
  onChange,
  newItem,
  renderItem,
  emptyLabel,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  emptyLabel: string;
}) {
  const addItem = () => onChange([...items, newItem()]);
  const removeItem = (id: string) => onChange(items.filter((i) => i.id !== id));
  const updateItem = (id: string, patch: Partial<T>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          {emptyLabel}
        </p>
      )}
      {items.map((item) => (
        <Card key={item.id} className="relative">
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-start justify-between">
              <GripVertical className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 px-2">{renderItem(item, (patch) => updateItem(item.id, patch))}</div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-600 hover:bg-red-50"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4" /> Ajouter {title.toLowerCase()}
      </Button>
    </div>
  );
}
