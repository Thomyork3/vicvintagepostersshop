import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpecialOrderButtonProps {
  imageUrl?: string;
}

export function SpecialOrderButton({ imageUrl }: SpecialOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 border-gray-300"
      >
        <HelpCircle className="w-4 h-4" />
        ¿No encontraste lo que buscabas?
      </Button>

      {}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">
                ¿Cómo hacer un pedido especial?
              </h2>

              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Instrucciones para pedido especial"
                    className="w-full rounded-lg"
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                  />
                  {}
                  <div className="absolute inset-0 bg-transparent" />
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                  <HelpCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    Próximamente se agregará la imagen con instrucciones
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Por ahora, contáctanos por WhatsApp o Instagram
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
