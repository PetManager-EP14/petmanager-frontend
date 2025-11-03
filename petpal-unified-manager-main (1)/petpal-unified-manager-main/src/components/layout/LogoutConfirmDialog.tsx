import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, X } from "lucide-react";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LogoutConfirmDialog({ open, onOpenChange, onConfirm }: LogoutConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md mx-auto pet-card border-border">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <LogOut className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="font-poppins text-pet-h3 text-pet-text-primary">
                ¿Cerrar Sesión?
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="font-roboto text-pet-text-secondary">
            ¿Estás seguro de que deseas salir de PetManager? Tendrás que volver a iniciar sesión para acceder al sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel 
            className="font-roboto font-medium text-pet-btn bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="font-roboto font-medium text-pet-btn bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}