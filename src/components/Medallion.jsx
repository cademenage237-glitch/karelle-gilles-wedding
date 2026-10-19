export default function Medallion({ size = 120, stroke = '#cda45e', className = '' }) {
  return (
    <div className={`medallion ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="94" stroke={stroke} strokeWidth="1.5" />
        <circle cx="100" cy="100" r="82" stroke={stroke} strokeWidth="1" opacity="0.6" />
        <text x="100" y="122" textAnchor="middle" fontFamily="Fraunces, serif" fontStyle="italic" fontSize="72" fill={stroke}>
          C&amp;G
        </text>
        {[0, 90, 180, 270].map((deg) => (
          <line key={deg} x1="100" y1="6" x2="100" y2="18" stroke={stroke} strokeWidth="1.5" transform={`rotate(${deg} 100 100)`} />
        ))}
      </svg>
    </div>
  );
}
