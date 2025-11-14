# Assets Migration Guide

## What Changed?

All Figma-specific asset imports (`figma:asset/...`) have been replaced with publicly accessible image URLs from Unsplash. This allows the application to be downloaded and run locally without any Figma dependencies.

## Changes Made

### Created: `/assets/images.ts`
A centralized file containing all image URLs used throughout the application.

**Exports:**
- `BACKGROUND_LOGO` - Large background image (2048x2048)
- `ALBUM_COVERS.cover1` - Album artwork for mock tracks
- `ALBUM_COVERS.cover2` - Album artwork for mock tracks
- `ALBUM_COVERS.cover3` - Album artwork for mock tracks

### Updated Files

**`/imports/LandingQueryResults.tsx`**
- Removed 4 Figma asset imports
- Added import: `import { BACKGROUND_LOGO, ALBUM_COVERS } from "../assets/images"`
- Updated mock track data to use `ALBUM_COVERS`
- Updated background image to use `BACKGROUND_LOGO`

**`/imports/Collection.tsx`**
- Removed 3 Figma asset imports
- Added import: `import { ALBUM_COVERS } from "../assets/images"`

## Original Figma Assets (Now Replaced)

1. `figma:asset/a8ad6f1b73e702152ba406e04cb258301ee222d3.png` → `BACKGROUND_LOGO`
2. `figma:asset/15494bf21ff66ca5409403e5f54604a120fe272e.png` → `ALBUM_COVERS.cover1`
3. `figma:asset/6cbb193d6d681c4997f20a810eba1dfa72d389af.png` → `ALBUM_COVERS.cover3`
4. `figma:asset/5b338b9124fa7fa381fdc152377164209480febd.png` → `ALBUM_COVERS.cover2`

## Customizing Images

To use your own images:

1. Open `/assets/images.ts`
2. Replace the Unsplash URLs with your own image URLs or local paths
3. No other changes needed - all components import from this central file

### Example: Using Local Images

```typescript
// /assets/images.ts
export const BACKGROUND_LOGO = "/images/background-logo.png";

export const ALBUM_COVERS = {
  cover1: "/images/album-1.jpg",
  cover2: "/images/album-2.jpg",
  cover3: "/images/album-3.jpg",
};
```

Then place your images in `/public/images/` folder.

## Benefits

✅ No Figma dependencies - runs 100% locally  
✅ Easy to customize all images in one place  
✅ Public URLs work immediately with no setup  
✅ Can easily switch to local images when needed  
✅ All images are now trackable in version control
