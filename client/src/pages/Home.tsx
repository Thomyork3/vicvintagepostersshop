import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { PosterGrid } from "@/components/PosterGrid";
import { SubcategoryGrid } from "@/components/SubcategoryGrid";
import { AdminPanel } from "@/components/AdminPanel";
import { SearchBar } from "@/components/SearchBar";
import { SocialLinks } from "@/components/SocialLinks";
import { SpecialOrderButton } from "@/components/SpecialOrderButton";
import { WelcomeModal, useWelcomeModal } from "@/components/WelcomeModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { CATEGORIES, Subcategory, Poster } from "@shared/types";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { isOpen, openModal, closeModal } = useWelcomeModal();

  const subcategoriesQuery = trpc.subcategories.getByCategory.useQuery(
    { categoria: selectedCategory! },
    { enabled: selectedCategory !== null && !selectedSubcategory }
  );
  
  const postersQuery = trpc.posters.getBySubcategory.useQuery(
    { subcategoria_id: selectedSubcategory?.id! },
    { enabled: !!selectedSubcategory }
  );
  
  const latestPostersQuery = trpc.posters.getLatest.useQuery({ limit: 12 });

  const handleUpdate = () => {
    subcategoriesQuery.refetch();
    postersQuery.refetch();
    latestPostersQuery.refetch();
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setSearchQuery("");
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setSearchQuery("");
  };

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const searchResultsQuery = trpc.search.posters.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length >= 2 }
  );

  const showSubcategories = selectedCategory && !selectedSubcategory && !searchQuery;
  const showPosters = selectedSubcategory || searchQuery;
  const showLatest = !selectedCategory && !selectedSubcategory && !searchQuery;

  const displayPosters = searchQuery ? (searchResultsQuery.data || []) : (selectedSubcategory ? postersQuery.data || [] : []);
  const displaySubcategories = subcategoriesQuery.data || [];

  const getTitle = () => {
    if (searchQuery) return `Resultados para "${searchQuery}"`;
    if (selectedSubcategory) return selectedSubcategory.nombre;
    if (selectedCategory) return CATEGORIES.find(c => c.id === selectedCategory)?.label;
    return "Últimos Agregados";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <WelcomeModal isOpen={isOpen} onClose={closeModal} />
      <header className="border-b bg-sky-300">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-.1">
            <div className="flex items-center gap-30">
              <img 
                src="https://catalogovicvintage.s3.us-east-1.amazonaws.com/Picsart_24-08-15_14-55-20-484.png" 
                alt="Posters Vicvintage" 
                className="h-19 md:h-23 object-contain"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-white">Posters</h1>
            </div>

            <nav className="hidden md:flex gap-3 overflow-x-auto">
              <Button
                variant={selectedCategory === null && !searchQuery ? "default" : "outline"}
                onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); setSearchQuery(""); }}
                className="whitespace-nowrap text-sm"
                size="sm"
              >
                Todos
              </Button>
              {CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => handleCategoryClick(category.id)}
                  className="whitespace-nowrap text-sm"
                  size="sm"
                >
                  {category.label}
                </Button>
              ))}
            </nav>
          </div>

          <nav className="md:hidden flex gap-2 overflow-x-auto mt-4 pb-2">
            <Button
              variant={selectedCategory === null && !searchQuery ? "default" : "outline"}
              onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); setSearchQuery(""); }}
              className="whitespace-nowrap text-xs"
              size="sm"
            >
              Todos
            </Button>
            {CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => handleCategoryClick(category.id)}
                className="whitespace-nowrap text-xs"
                size="sm"
              >
                {category.label}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {(selectedCategory || selectedSubcategory || searchQuery) && (
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {searchQuery ? "Limpiar búsqueda" : "Regresar"}
          </Button>
        )}

        <h2 className="text-2xl font-bold mb-8">{getTitle()}</h2>

        {showSubcategories && (
          <SubcategoryGrid
            subcategories={displaySubcategories}
            isLoading={subcategoriesQuery.isLoading}
            onSelect={handleSubcategoryClick}
          />
        )}

        {showPosters && (
          <PosterGrid
            posters={displayPosters}
            isLoading={postersQuery.isLoading}
          />
        )}

        {showLatest && (
          <PosterGrid
            posters={latestPostersQuery.data || []}
            isLoading={latestPostersQuery.isLoading}
          />
        )}

        <div className="mt-12 flex flex-col items-center gap-4">
          <SpecialOrderButton />
          <Button
            variant="outline"
            onClick={openModal}
            className="text-sm"
          >
            <Info className="w-4 h-4 mr-2" />
            Acerca de Vic Vintage
          </Button>
        </div>
      </main>

      <footer className="py-8 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4 mb-6">
            <p className="text-gray-600 text-sm">Síguenos en redes sociales</p>
            <SocialLinks 
              instagram="https://www.instagram.com/vicvintage_?igsh=dXBkd2lqZjk0OG5w"
              tiktok="https://www.tiktok.com/@vicvintage_?_r=1&_t=ZS-92eB6M4Oo2C"
              whatsapp=""
            />
          </div>

          <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
            <AdminPanel onUpdate={handleUpdate} minimal />
          </div>

          <p className="text-center text-gray-400 text-xs mt-4">
            © 2026 Posters Vicvintage. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
