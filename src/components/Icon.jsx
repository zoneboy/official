export default function Icon({ name, fill = false, size = 24, style = {} }) {
  return <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill?1:0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`, fontSize: size, verticalAlign: "middle", lineHeight: 1, ...style }}>{name}</span>;
}
