import { useState } from "react";
import { Poster, Subcategory, CATEGORIES } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Edit, Trash2, Plus, FolderPlus, ImagePlus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminPanelProps {
  onUpdate?: () => void;
  minimal?: boolean;
}

export function AdminPanel({ onUpdate, minimal }: AdminPanelProps) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("subcategories");
  
  // Estados para subcategorías
  const [subName, setSubName] = useState("");
  const [subImageUrl, setSubImageUrl] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  
  // Estados para posters
  const [posterTitle, setPosterTitle] = useState("");
  const [posterImageUrl, setPosterImageUrl] = useState("");
  const [posterPrice, setPosterPrice] = useState("");
  const [posterCategory, setPosterCategory] = useState("");
  const [posterSubcategoryId, setPosterSubcategoryId] = useState("");
  const [editingPoster, setEditingPoster] = useState<Poster | null>(null);

  const subcategoriesQuery = trpc.subcategories.getAll.useQuery();
  const postersQuery = trpc.posters.getAll.useQuery();
  
  const createSubcategoryMutation = trpc.subcategories.create.useMutation({
    onSuccess: () => {
      toast.success("Subcategoría creada");
      resetSubcategoryForm();
      subcategoriesQuery.refetch();
      onUpdate?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const updateSubcategoryMutation = trpc.subcategories.update.useMutation({
    onSuccess: () => {
      toast.success("Subcategoría actualizada");
      resetSubcategoryForm();
      subcategoriesQuery.refetch();
      onUpdate?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteSubcategoryMutation = trpc.subcategories.delete.useMutation({
    onSuccess: () => {
      toast.success("Subcategoría eliminada");
      subcategoriesQuery.refetch();
      postersQuery.refetch();
      onUpdate?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const createPosterMutation = trpc.posters.create.useMutation({
    onSuccess: () => {
      toast.success("Poster creado");
      resetPosterForm();
      postersQuery.refetch();
      onUpdate?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const updatePosterMutation = trpc.posters.update.useMutation({
    onSuccess: () => {
      toast.success("Poster actualizado");
      resetPosterForm();
      postersQuery.refetch();
      onUpdate?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const deletePosterMutation = trpc.posters.delete.useMutation({
    onSuccess: () => {
      toast.success("Poster eliminado");
      postersQuery.refetch();
      onUpdate?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const resetSubcategoryForm = () => {
    setSubName("");
    setSubImageUrl("");
    setSubCategory("");
    setEditingSubcategory(null);
  };

  const resetPosterForm = () => {
    setPosterTitle("");
    setPosterImageUrl("");
    setPosterPrice("");
    setPosterCategory("");
    setPosterSubcategoryId("");
    setEditingPoster(null);
  };

  const handleCreateSubcategory = () => {
    if (!subName || !subImageUrl || !subCategory || !password) {
      toast.error("Completa todos los campos");
      return;
    }
    createSubcategoryMutation.mutate({
      nombre: subName,
      imagen_url: subImageUrl,
      categoria: subCategory as any,
      password,
    });
  };

  const handleUpdateSubcategory = () => {
    if (!editingSubcategory || !password) return;
    updateSubcategoryMutation.mutate({
      id: editingSubcategory.id,
      nombre: subName || undefined,
      imagen_url: subImageUrl || undefined,
      categoria: subCategory as any || undefined,
      password,
    });
  };

  const handleDeleteSubcategory = (id: string) => {
    if (!password) {
      toast.error("Ingresa la contraseña");
      return;
    }
    if (confirm("¿Eliminar subcategoría? También se eliminarán todos sus posters.")) {
      deleteSubcategoryMutation.mutate({ id, password });
    }
  };

  const handleCreatePoster = () => {
    if (!posterTitle || !posterImageUrl || !posterPrice || !posterCategory || !posterSubcategoryId || !password) {
      toast.error("Completa todos los campos");
      return;
    }
    createPosterMutation.mutate({
      titulo: posterTitle,
      imagen_url: posterImageUrl,
      precio: Math.round(parseFloat(posterPrice) * 100),
      categoria: posterCategory as any,
      subcategoria_id: posterSubcategoryId,
      password,
    });
  };

  const handleUpdatePoster = () => {
    if (!editingPoster || !password) return;
    updatePosterMutation.mutate({
      id: editingPoster.id,
      titulo: posterTitle || undefined,
      imagen_url: posterImageUrl || undefined,
      precio: posterPrice ? Math.round(parseFloat(posterPrice) * 100) : undefined,
      categoria: posterCategory as any || undefined,
      subcategoria_id: posterSubcategoryId || undefined,
      password,
    });
  };

  const handleDeletePoster = (id: string) => {
    if (!password) {
      toast.error("Ingresa la contraseña");
      return;
    }
    if (confirm("¿Eliminar este poster?")) {
      deletePosterMutation.mutate({ id, password });
    }
  };

  const startEditSubcategory = (sub: Subcategory) => {
    setEditingSubcategory(sub);
    setSubName(sub.nombre);
    setSubImageUrl(sub.imagen_url);
    setSubCategory(sub.categoria);
  };

  const startEditPoster = (poster: Poster) => {
    setEditingPoster(poster);
    setPosterTitle(poster.titulo);
    setPosterImageUrl(poster.imagen_url);
    setPosterPrice((poster.precio / 100).toString());
    setPosterCategory(poster.categoria);
    setPosterSubcategoryId(poster.subcategoria_id);
  };

  // Filtrar subcategorías por categoría seleccionada
  const filteredSubcategories = posterCategory 
    ? (subcategoriesQuery.data || []).filter(s => s.categoria === posterCategory)
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {minimal ? (
          <Button 
            variant="ghost" 
            size="icon"
            className="w-8 h-8 text-gray-300 hover:text-gray-400 hover:bg-gray-50"
          >
            <Settings className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="outline" className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600">
            <Settings className="w-4 h-4 mr-2" />
            Administrar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Panel de Administración</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Campo de contraseña global */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <Label htmlFor="admin-password" className="text-sm font-medium">
              Contraseña de Administrador
            </Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña"
              className="mt-1"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subcategories">
                <FolderPlus className="w-4 h-4 mr-2" />
                Subcategorías
              </TabsTrigger>
              <TabsTrigger value="posters">
                <ImagePlus className="w-4 h-4 mr-2" />
                Posters
              </TabsTrigger>
            </TabsList>

            {/* Tab de Subcategorías */}
            <TabsContent value="subcategories" className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold">
                  {editingSubcategory ? "Editar Subcategoría" : "Nueva Subcategoría"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      placeholder="Ej: Fútbol Internacional"
                    />
                  </div>
                  <div>
                    <Label>URL de Imagen</Label>
                    <Input
                      value={subImageUrl}
                      onChange={(e) => setSubImageUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label>Categoría</Label>
                    <Select value={subCategory} onValueChange={setSubCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
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
                </div>
                <div className="flex gap-2">
                  {editingSubcategory ? (
                    <>
                      <Button onClick={handleUpdateSubcategory} disabled={updateSubcategoryMutation.isPending}>
                        Guardar Cambios
                      </Button>
                      <Button variant="outline" onClick={resetSubcategoryForm}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleCreateSubcategory} disabled={createSubcategoryMutation.isPending}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Subcategoría
                    </Button>
                  )}
                </div>
              </div>

              {/* Lista de subcategorías */}
              <ScrollArea className="h-60">
                <div className="space-y-2 pr-4">
                  {(subcategoriesQuery.data || []).map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={sub.imagen_url} alt={sub.nombre} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium">{sub.nombre}</p>
                          <p className="text-xs text-gray-500">{CATEGORIES.find(c => c.id === sub.categoria)?.label}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEditSubcategory(sub)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteSubcategory(sub.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Tab de Posters */}
            <TabsContent value="posters" className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold">
                  {editingPoster ? "Editar Poster" : "Nuevo Poster"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={posterTitle}
                      onChange={(e) => setPosterTitle(e.target.value)}
                      placeholder="Ej: Selección Argentina"
                    />
                  </div>
                  <div>
                    <Label>URL de Imagen</Label>
                    <Input
                      value={posterImageUrl}
                      onChange={(e) => setPosterImageUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label>Precio (MXN)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={posterPrice}
                      onChange={(e) => setPosterPrice(e.target.value)}
                      placeholder="50.00"
                    />
                  </div>
                  <div>
                    <Label>Categoría</Label>
                    <Select value={posterCategory} onValueChange={(v) => { setPosterCategory(v); setPosterSubcategoryId(""); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
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
                  <div className="md:col-span-2">
                    <Label>Subcategoría</Label>
                    <Select value={posterSubcategoryId} onValueChange={setPosterSubcategoryId} disabled={!posterCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder={posterCategory ? "Seleccionar subcategoría" : "Primero selecciona categoría"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSubcategories.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  {editingPoster ? (
                    <>
                      <Button onClick={handleUpdatePoster} disabled={updatePosterMutation.isPending}>
                        Guardar Cambios
                      </Button>
                      <Button variant="outline" onClick={resetPosterForm}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleCreatePoster} disabled={createPosterMutation.isPending}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Poster
                    </Button>
                  )}
                </div>
              </div>

              {/* Lista de posters */}
              <ScrollArea className="h-60">
                <div className="space-y-2 pr-4">
                  {(postersQuery.data || []).map((poster) => (
                    <div key={poster.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={poster.imagen_url} alt={poster.titulo} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium">{poster.titulo}</p>
                          <p className="text-xs text-gray-500">${(poster.precio / 100).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEditPoster(poster)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeletePoster(poster.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
