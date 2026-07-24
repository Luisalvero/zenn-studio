# Image assets

Drop your real images here — the app references them by path and shows a
tasteful placeholder until the file exists, so nothing breaks in the meantime.

## Portrait (About page)

Save your photo as:

```
public/images/portrait.jpg
```

(Configured in `src/config/site.ts` → `portrait`. A roughly 4:5 portrait crop
looks best; 1000×1250px or larger is plenty.)

## Project stills & thumbnails

Create a folder per project slug and set the paths in `src/data/projects.ts`:

```
public/images/projects/<slug>/thumb.jpg
public/images/projects/<slug>/still-1.jpg
...
```

Example: `public/images/projects/echoes-in-the-static/thumb.jpg`

## Social share image

Add a 1200×630 `public/og-image.jpg` for link previews.
