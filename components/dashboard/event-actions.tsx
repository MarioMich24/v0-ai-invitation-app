'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreVertical, Send, Archive, Trash2, Pencil } from 'lucide-react'
import { updateEvent, deleteEvent } from '@/app/actions/event-actions'
import { toast } from 'sonner'
import type { Event } from '@/lib/types'

interface EventActionsProps {
  event: Event
}

export function EventActions({ event }: EventActionsProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePublish = async () => {
    setIsLoading(true)
    const result = await updateEvent(event.id, { status: 'published' })
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Evento publicado exitosamente')
    router.refresh()
  }

  const handleArchive = async () => {
    setIsLoading(true)
    const result = await updateEvent(event.id, { status: 'archived' })
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Evento archivado')
    router.refresh()
  }

  const handleDelete = async () => {
    setIsLoading(true)
    await deleteEvent(event.id)
    // Redirect happens in the action
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {event.status === 'draft' && (
          <Button onClick={handlePublish} disabled={isLoading} className="rounded-xl">
            <Send className="mr-2 h-4 w-4" />
            Publicar
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-xl">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Editar Evento
            </DropdownMenuItem>
            {event.status !== 'archived' && (
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="mr-2 h-4 w-4" />
                Archivar
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Evento</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. Se eliminara permanentemente el evento
              &quot;{event.title}&quot; junto con todas sus confirmaciones y regalos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
