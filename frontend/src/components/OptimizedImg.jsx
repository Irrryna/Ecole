/* Affiche <picture> avec WebP + fallback JPG + responsive + lazy.
   - baseName: "slide1"  (fichiers attendus: /images/slide1-480.webp, -768.webp, ... et .jpg)
   - alt: texte alternatif
   - sizes: attribut sizes (ex: "100vw" pour plein écran)
   - width / height: dimensions du PLUS GRAND fichier (pour éviter le CLS)
   - priority: true pour l’image LCP (héro) → preload + fetchpriority="high"
*/
const BREAKPOINTS = [480, 768, 1024, 1280, 1600, 1920];

export default function OptimizedImg({
  baseName,
  alt = "",
  className,
  sizes = "100vw",
  width,
  height,
  priority = false
}){
  const webp = BREAKPOINTS.map(w => `/images/${baseName}-${w}.webp ${w}w`).join(", ");
  const jpg  = BREAKPOINTS.map(w => `/images/${baseName}-${w}.jpg ${w}w`).join(", ");
  const defaultSrc = `/images/${baseName}-1024.jpg`;

  return (
    <picture>
      <source type="image/webp" srcSet={webp} sizes={sizes} />
      <source type="image/jpeg" srcSet={jpg}  sizes={sizes} />
      <img
        src={defaultSrc}
        alt={alt}
        className={className}
        loading={priority ? undefined : "lazy"}
        decoding="async"
        fetchpriority={priority ? "high" : "auto"}
        width={width}
        height={height}
        style={width && height ? undefined : { aspectRatio: "16 / 9", width:"100%", height:"auto" }}
      />
    </picture>
  );
}
