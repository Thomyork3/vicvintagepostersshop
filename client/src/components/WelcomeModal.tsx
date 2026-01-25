import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="bg-gradient-to-br from-sky-100 to-sky-200 p-12 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Bienvenido a VicVintage
              </h2>
              
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setIsOpen(true);
      localStorage.setItem("hasSeenWelcome", "true");
    }
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
}
