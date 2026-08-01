---
title: "Rendering a Full Human Skeleton in the Browser: Skeleton Anatomy Dev Notes"
excerpt: Hands-on experience building a 3D medical education app with Three.js + React, including model optimization, interaction design, and mobile adaptation.
date: 2026-06-28
section: product
tags: [Three.js, 3D, 医学, Skeleton Anatomy]
---
## The Goal

Build a complete 3D model of the human skeleton that can be rotated, zoomed, and annotated in the browser. Aimed at medical students and anatomy enthusiasts.

## Model Source

The skeleton model comes from an open medical 3D dataset; the original model has 2 million polygons. Loading it directly would crash the browser.

### Optimization Pipeline

```
Original model (2M polys) → Blender simplification → 200K polys → Draco compression → 6MB GLB
```

The 6MB GLB file is cached after the first load, so subsequent opens load instantly.

## Interaction Design

The biggest challenge is annotation in 3D space. Our approach:

1. Each bone has its own mesh ID
2. Click a bone → Raycaster hit → highlight + info panel pops up
3. The info panel follows the 3D position but renders on a 2D HTML layer

## Mobile

Using the gyroscope to rotate the skeleton on a phone turned out to be a surprisingly good experience. Supports pinch-to-zoom and one-finger rotation.
