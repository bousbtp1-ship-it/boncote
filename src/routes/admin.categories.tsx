import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import SiteLayout from '@/components/boncote/site-layout'
import { categories as initialCategories, type Category, type CategoryId } from '@/data/fixtures'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus } from 'lucide-react'

export const Route = createFileRoute('/admin/categories')({
  component: AdminCategories,
})

type EditableCategory = Category & { id: CategoryId | string }

function AdminCategories() {
  const [cats, setCats] = useState<EditableCategory[]>(initialCategories)
  const [editTarget, setEditTarget] = useState<EditableCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<EditableCategory | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ id: '', label: '', description: '', count: '' })

  function openEdit(cat: EditableCategory) {
    setEditTarget(cat)
    setForm({ id: cat.id, label: cat.label, description: cat.description, count: String(cat.count) })
  }

  function saveEdit() {
    if (!editTarget) return
    if (!form.label.trim() || !form.description.trim()) {
      toast.error('Le nom et la description sont obligatoires.')
      return
    }
    setCats((prev) =>
      prev.map((c) =>
        c.id === editTarget.id
          ? { ...c, label: form.label.trim(), description: form.description.trim(), count: Number(form.count) || c.count }
          : c,
      ),
    )
    toast.success('Catégorie mise à jour.')
    setEditTarget(null)
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setCats((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    toast.success('Catégorie supprimée.')
    setDeleteTarget(null)
  }

  function openAdd() {
    setForm({ id: '', label: '', description: '', count: '0' })
    setAddOpen(true)
  }

  function saveAdd() {
    const id = form.id.trim().toLowerCase().replace(/\s+/g, '-')
    if (!id || !form.label.trim() || !form.description.trim()) {
      toast.error('Tous les champs sont obligatoires.')
      return
    }
    if (cats.some((c) => c.id === id)) {
      toast.error('Un identifiant identique existe déjà.')
      return
    }
    setCats((prev) => [
      ...prev,
      { id: id as CategoryId, label: form.label.trim(), description: form.description.trim(), count: Number(form.count) || 0 },
    ])
    toast.success('Catégorie ajoutée.')
    setAddOpen(false)
  }

  return (
    <SiteLayout>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des catégories</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {cats.length} catégorie{cats.length > 1 ? 's' : ''} enregistrée{cats.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/admin">Retour à l'administration</Link>
            </Button>
            <Button onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>
        <div className="rounded-xl border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identifiant</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Annonces</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cats.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-mono text-sm text-muted-foreground">{cat.id}</TableCell>
                  <TableCell className="font-semibold">{cat.label}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cat.description}</TableCell>
                  <TableCell className="text-right tabular-nums">{cat.count.toLocaleString('fr-FR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(cat)} aria-label={'Modifier ' + cat.label}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(cat)} aria-label={'Supprimer ' + cat.label}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) setEditTarget(null) }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier la catégorie</DialogTitle>
              <DialogDescription>Modifiez le nom et la description de la catégorie.</DialogDescription>
            </DialogHeader>
            <CategoryForm form={form} setForm={setForm} idDisabled />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditTarget(null)}>Annuler</Button>
              <Button onClick={saveEdit}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une catégorie</DialogTitle>
              <DialogDescription>Renseignez les informations de la nouvelle catégorie.</DialogDescription>
            </DialogHeader>
            <CategoryForm form={form} setForm={setForm} />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setAddOpen(false)}>Annuler</Button>
              <Button onClick={saveAdd}>Ajouter</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer la catégorie</DialogTitle>
              <DialogDescription>
                Voulez-vous vraiment supprimer <strong>{deleteTarget?.label}</strong> ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Annuler</Button>
              <Button variant="destructive" onClick={confirmDelete}>Supprimer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </SiteLayout>
  )
}

type FormState = { id: string; label: string; description: string; count: string }

function CategoryForm({
  form,
  setForm,
  idDisabled,
}: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  idDisabled?: boolean
}) {
  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-1.5">
        <Label htmlFor="cat-id">Identifiant</Label>
        <Input id="cat-id" value={form.id} disabled={idDisabled} placeholder="ex: mode" onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="cat-label">Nom</Label>
        <Input id="cat-label" value={form.label} placeholder="ex: Mode & Vêtements" onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="cat-desc">Description</Label>
        <Input id="cat-desc" value={form.description} placeholder="ex: Vêtements, chaussures, accessoires" onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="cat-count">Nombre d'annonces</Label>
        <Input id="cat-count" type="number" min={0} value={form.count} onChange={(e) => setForm((f) => ({ ...f, count: e.target.value }))} />
      </div>
    </div>
  )
}
