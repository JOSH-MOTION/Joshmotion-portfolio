import type { GalleryPhoto } from "@/lib/data";

export type GalleryCell =
  | { kind: "photo"; photo: GalleryPhoto; index: number }
  | { kind: "group"; project: string; photos: GalleryPhoto[]; index: number };

/** Clusters photos that share a non-empty `project` into one grid cell,
 * keeping every other photo as its own cell. `index` is each cell's
 * position in the original (flat) array — used to open the Lightbox at
 * the right spot, since Lightbox still browses the full flat list. */
export function groupPhotosForDisplay(photos: GalleryPhoto[]): GalleryCell[] {
  const grouped = new Set<string>();
  const cells: GalleryCell[] = [];

  photos.forEach((photo, index) => {
    if (grouped.has(photo.id)) return;

    if (photo.project) {
      const members = photos.filter((p) => p.project === photo.project);
      if (members.length > 1) {
        members.forEach((m) => grouped.add(m.id));
        cells.push({ kind: "group", project: photo.project, photos: members, index });
        return;
      }
    }

    cells.push({ kind: "photo", photo, index });
  });

  return cells;
}
