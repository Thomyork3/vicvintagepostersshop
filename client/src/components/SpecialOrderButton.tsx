import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";

export function SpecialOrderButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          ¿No encontraste lo que buscabas?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">¿Cómo hacer un pedido especial?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img 
            src="https://catalogovicvintage.s3.us-east-1.amazonaws.com/COMPRA+.png" 
            alt="Cómo realizar una compra"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
   );
}
