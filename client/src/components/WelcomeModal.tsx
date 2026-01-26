import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50 rounded-full bg-white/90 hover:bg-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-4">
            Bienvenido a VicVintage
          </h2>
          
          <img 
            src="https://catalogovicvintage.s3.us-east-1.amazonaws.com/PRESENTACION.png" 
            alt="Vic Vintage Presentación"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
   );
}

export function useWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setIsOpen(true);
      sessionStorage.setItem("hasSeenWelcome", "true");
    }
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
}

export function WelcomeButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
    >
      <Sparkles className="mr-2 h-5 w-5" />
      Acerca de Vic Vintage
    </Button>
  );
}
