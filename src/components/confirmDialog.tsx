import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
    type: string;
    title: string;
    contents: string;
    open: boolean;
    isDeleteLoading: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void
}

export const ConfirmDialog = ({type, title, contents, open, isDeleteLoading, onOpenChange, onConfirm}: ConfirmDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[30rem] gap-8">
                <DialogHeader>
                    <DialogTitle aria-label="dialog_title">{title}</DialogTitle>
                    <DialogDescription aria-label="dialog_desc">
                        {type} Dialog
                    </DialogDescription>
                </DialogHeader>
                <p aria-label="dialog_contents">{contents}</p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost" aria-label="dialog_cancel_button">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" type="button" disabled={isDeleteLoading} onClick={() => {
                        onConfirm();
                        onOpenChange(false);
                    }}
                            aria-label="dialog_approve_button"
                    >{type}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}