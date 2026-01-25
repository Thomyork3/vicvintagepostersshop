import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (password: string) => Promise<void>;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export function AuthDialog({
  open,
  onOpenChange,
  onSubmit,
  title = "Autenticación Requerida",
  description = "Ingresa la contraseña para continuar",
  isLoading = false,
}: AuthDialogProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(password);
    setPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">{description}</p>
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading || !password}>
            {isLoading ? "Verificando..." : "Continuar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
