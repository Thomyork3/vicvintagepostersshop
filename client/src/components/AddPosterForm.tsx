import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES } from "@shared/types";
import { AuthDialog } from "./AuthDialog";

interface AddPosterFormProps {
  onSuccess?: () => void;
}

export function AddPosterForm({ onSuccess }: AddPosterFormProps) {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "",
    precio: "",
    imagen_url: "",
  });

  const createMutation = trpc.posters.create.useMutation();
  const utils = trpc.useUtils();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo || !formData.categoria || !formData.precio || !formData.imagen_url) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setAuthOpen(true);
  };

  const handleAuth = async (password: string) => {
    try {
      await createMutation.mutateAsync({
        titulo: formData.titulo,
        categoria: formData.categoria as any,
        precio: Math.round(parseFloat(formData.precio) * 100),
        imagen_url: formData.imagen_url,
        password,
      });

      await utils.posters.getAll.invalidate();
      await utils.posters.getLatest.invalidate();

      toast.success("Poster agregado exitosamente");
      setFormData({ titulo: "", categoria: "", precio: "", imagen_url: "" });
      setOpen(false);
      setAuthOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Error al agregar el poster");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Agregar Poster
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Poster</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título</label>
              <Input
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: Poster Nirvana - Nevermind"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Categoría</label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Precio (USD)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                placeholder="Ej: 50.00"
              />
            </div>

            <div>
              <label className="text-sm font-medium">URL de Imagen</label>
              <Input
                type="url"
                value={formData.imagen_url}
                onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Agregando..." : "Continuar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSubmit={handleAuth}
        title="Agregar Poster"
        description="Ingresa la contraseña para agregar el poster"
        isLoading={createMutation.isPending}
      />
    </>
  );
}
