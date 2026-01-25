import { useState } from "react";
import { Poster } from "@shared/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CATEGORIES } from "@shared/types";
import { trpc } from "@/lib/trpc";
import { AuthDialog } from "./AuthDialog";

interface EditPosterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  poster: Poster;
  onUpdate?: () => void;
}

export function EditPosterDialog({ open, onOpenChange, poster, onUpdate }: EditPosterDialogProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [formData, setFormData] = useState<{
    titulo: string;
    categoria: "Albumes" | "Bandas" | "Peliculas" | "Personajes" | "Artistas_Deportistas" | "Photocards" | "Otros";
    precio: string;
    imagen_url: string;
  }>({
    titulo: poster.titulo,
    categoria: poster.categoria,
    precio: (poster.precio / 100).toString(),
    imagen_url: poster.imagen_url,
  });

  const updateMutation = trpc.posters.update.useMutation();
  const utils = trpc.useUtils();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthOpen(true);
  };

  const handleAuth = async (password: string) => {
    try {
      const updateData: any = {
        id: poster.id,
        password,
      };

      if (formData.titulo !== poster.titulo) updateData.titulo = formData.titulo;
      if (formData.categoria !== poster.categoria) updateData.categoria = formData.categoria as "Albumes" | "Bandas" | "Peliculas" | "Personajes" | "Artistas_Deportistas" | "Photocards" | "Otros";
      if (formData.precio !== (poster.precio / 100).toString()) updateData.precio = Math.round(parseFloat(formData.precio) * 100);
      if (formData.imagen_url !== poster.imagen_url) updateData.imagen_url = formData.imagen_url;

      await updateMutation.mutateAsync(updateData);

      await utils.posters.getAll.invalidate();
      await utils.posters.getLatest.invalidate();

      toast.success("Poster actualizado exitosamente");
      onOpenChange(false);
      setAuthOpen(false);
      onUpdate?.();
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar el poster");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Poster</DialogTitle>
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
              <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value as any })}>
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

            <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Actualizando..." : "Continuar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSubmit={handleAuth}
        title="Editar Poster"
        description="Ingresa la contraseña para guardar los cambios"
        isLoading={updateMutation.isPending}
      />
    </>
  );
}
